import { AttributeValue, ConditionalCheckFailedException, DynamoDBClient, PutItemCommand, PutItemCommandInput, PutItemInput, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ClassConstructor } from "class-transformer";
import { ClassSerializer } from "../util/ClassSerializer";
import { DynamoDBKeyNames, GSIIndexNames } from "./DynamoDBConstants";
import "dotenv/config";
import { UniqueObjectAlreadyExistsError } from "./error";
import { PaginatedResponse } from "./PaginatedResponse";

export abstract class Repository<T> {
  // Used to create composite primary and sort keys.
  static compositeKeyDelimeter = "-";

  client: DynamoDBClient;
  serializer: ClassSerializer;
  itemType: ClassConstructor<T>;

  constructor(client: DynamoDBClient, itemType: ClassConstructor<T>) {
    this.client = client;
    this.serializer = new ClassSerializer();
    this.itemType = itemType;
  }

  abstract createPartitionKey(object: T): string;
  abstract createSortKey(object: T): string;

  // Saves an item and fails if an object with the same pkey and skey already exist.
  async saveItem(params: {
    object: T,
    checkForExistingKey: "PRIMARY" | "COMPOSITE" | "NONE",
    additionalItems?: Record<string, AttributeValue>;
  }) {

    const serializedObject = this.serializer.classToPlainJson(params.object);
    const commandParams: PutItemCommandInput = {
      TableName: process.env.DYNAMO_MAIN_TABLE_NAME!,
      Item: marshall(serializedObject),
    }

    if (params.checkForExistingKey === 'PRIMARY') {
      commandParams.ConditionExpression = `attribute_not_exists(${DynamoDBKeyNames.PARTITION_KEY})`
    } else if (params.checkForExistingKey === 'COMPOSITE') {
      commandParams.ConditionExpression = `attribute_not_exists(${DynamoDBKeyNames.PARTITION_KEY}) and attribute_not_exists(${DynamoDBKeyNames.SORT_KEY})`
    }

    commandParams.Item![DynamoDBKeyNames.PARTITION_KEY] = { S: this.createPartitionKey(params.object) }
    commandParams.Item![DynamoDBKeyNames.SORT_KEY] = { S: this.createSortKey(params.object) }

    if (params.additionalItems) {
      Object.keys(params.additionalItems).forEach(key => {
        commandParams.Item![key] = params.additionalItems![key];
      })
    }

    try {
      return await this.client.send(new PutItemCommand(commandParams));
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) {
        throw new UniqueObjectAlreadyExistsError();
      }
      throw error;
    }
  }

  /**
   * Attempts to retrieve an item using a composite key. 
   * @param primaryKey DynamoDB Partition/Primary Key
   * @param sortKey DynamoDB Sort Key
   * @param shouldPartialMatchSortKey Enables partial match a sort key instead of a complete match (partial match only based on what the sort key begins with.)
   * @returns null if not found, an error if more than 1 of the item is found, or the item if it is found.
   */
  async getUniqueItemByCompositeKey(params: {
    primaryKey: string,
    sortKey: string,
    shouldPartialMatchSortKey: boolean,
    indexName?: GSIIndexNames
  }) {

    let keyConditionExpression = `${DynamoDBKeyNames.PARTITION_KEY} = :PkeyValue`;
    if (params.shouldPartialMatchSortKey) {
      keyConditionExpression += ` and begins_with(${DynamoDBKeyNames.SORT_KEY}, :SkeyValue)`;
    } else {
      keyConditionExpression += ` and ${DynamoDBKeyNames.SORT_KEY} = :SkeyValue)`;
    }

    const commandParams: QueryCommandInput = {
      TableName: process.env.DYNAMO_MAIN_TABLE_NAME!,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: {
        ":PkeyValue": { S: params.primaryKey },
        ":SkeyValue": { S: params.sortKey }
      }
    }
    if (params.indexName) {
      commandParams.IndexName = params.indexName
    }

    const response = await this.client.send(new QueryCommand(commandParams));
    if (response.Items!.length === 0) {
      return null;
    }
    if (response.Items!.length > 1) {
      return new Error("Found more than 1 user when there should not be");
    }
    return this.serializer.plainJsonToClass(this.itemType, unmarshall(response.Items![0]));
  }

  async getItemsByCompositeKey(params: {
    primaryKey: string,
    sortKey: string,
    shouldPartialMatchSortKey: boolean,
    indexName?: GSIIndexNames,
    paginationToken?: Record<string, AttributeValue>,
    queryLimit?: number
  }): Promise<PaginatedResponse<T[]>> {

    let partitionKeyName;
    let sortKeyName;
    switch (params.indexName) {
      case GSIIndexNames.GSI1:
        partitionKeyName = DynamoDBKeyNames.GSI1_PARTITION_KEY;
        sortKeyName = DynamoDBKeyNames.GSI1_SORT_KEY
        break;
      case GSIIndexNames.GSI2:
        partitionKeyName = DynamoDBKeyNames.GSI2_PARTITION_KEY;
        sortKeyName = DynamoDBKeyNames.GSI2_SORT_KEY
        break;
      case GSIIndexNames.GSI3:
        partitionKeyName = DynamoDBKeyNames.GSI3_PARTITION_KEY;
        sortKeyName = DynamoDBKeyNames.GSI3_SORT_KEY
        break;
      default:
        partitionKeyName = DynamoDBKeyNames.PARTITION_KEY;
        sortKeyName = DynamoDBKeyNames.SORT_KEY
        break;
    }

    let keyConditionExpression = `${partitionKeyName} = :PkeyValue`;
    if (params.shouldPartialMatchSortKey) {
      keyConditionExpression += ` and begins_with(${sortKeyName}, :SkeyValue)`;
    } else {
      keyConditionExpression += ` and ${sortKeyName} = :SkeyValue)`;
    }

    const commandParams: QueryCommandInput = {
      TableName: process.env.DYNAMO_MAIN_TABLE_NAME!,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: {
        ":PkeyValue": { S: params.primaryKey },
        ":SkeyValue": { S: params.sortKey }
      }
    }

    if (params.indexName) {
      commandParams.IndexName = params.indexName;
    }

    if (params.paginationToken) {
      commandParams.ExclusiveStartKey = params.paginationToken;
    }
    if (params.queryLimit) {
      commandParams.Limit = params.queryLimit;
    }

    const dynamoResponse = await this.client.send(new QueryCommand(commandParams));

    const paginatedResponse = new PaginatedResponse<T[]>([]);
    if (dynamoResponse.Items!.length === 0) {
      return paginatedResponse;
    }

    paginatedResponse.data = dynamoResponse.Items!.map(item =>
      this.serializer.plainJsonToClass(this.itemType, unmarshall(item))
    );
    paginatedResponse.paginationToken = dynamoResponse.LastEvaluatedKey || null;

    return paginatedResponse;
  }

}