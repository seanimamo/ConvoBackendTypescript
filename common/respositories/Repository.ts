import { AttributeValue, ConditionalCheckFailedException, DynamoDBClient, PutItemCommand, PutItemCommandInput, PutItemInput, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ClassConstructor } from "class-transformer";
import { ClassSerializer } from "../util/ClassSerializer";
import { DynamoDbIndex, DYNAMODB_INDEXES } from "./DynamoDBConstants";
import "dotenv/config";
import { UniqueObjectAlreadyExistsError } from "./error";
import { PaginatedResponse } from "./PaginatedResponse";

export abstract class Repository<T> {
  // Used to create composite primary and sort keys.
  static compositeKeyDelimeter = "#";

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
    extraItemAttributes?: Record<string, AttributeValue>,
    denormalize?: boolean;
  }) {

    const commandParams: PutItemCommandInput = {
      TableName: process.env.DYNAMO_MAIN_TABLE_NAME!,
      Item: {},
    }

    if (params.denormalize === true) {
      commandParams.Item!['data'] = { S: this.serializer.serialize(params.object) }
    } else {
      commandParams.Item = marshall(this.serializer.classToPlainJson(params.object));
    }

    const primaryKeyName = DYNAMODB_INDEXES.PRIMARY.partitionKeyName;
    const sortKeyName = DYNAMODB_INDEXES.PRIMARY.sortKeyName;

    commandParams.Item![primaryKeyName] = { S: this.createPartitionKey(params.object) }
    commandParams.Item![sortKeyName] = { S: this.createSortKey(params.object) }
    if (params.extraItemAttributes) {
      Object.keys(params.extraItemAttributes).forEach(key => {
        commandParams.Item![key] = params.extraItemAttributes![key];
      })
    }

    if (params.checkForExistingKey === 'PRIMARY') {
      commandParams.ConditionExpression = `attribute_not_exists(${primaryKeyName})`
    } else if (params.checkForExistingKey === 'COMPOSITE') {
      commandParams.ConditionExpression = `attribute_not_exists(${primaryKeyName}) and attribute_not_exists(${sortKeyName})`
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
    index?: DynamoDbIndex,
    denormalize?: boolean
  }) {

    let keyConditionExpression = `${DYNAMODB_INDEXES.PRIMARY.partitionKeyName} = :PkeyValue`;
    if (params.shouldPartialMatchSortKey) {
      keyConditionExpression += ` and begins_with(${DYNAMODB_INDEXES.PRIMARY.sortKeyName}, :SkeyValue)`;
    } else {
      keyConditionExpression += ` and ${DYNAMODB_INDEXES.PRIMARY.sortKeyName} = :SkeyValue)`;
    }

    const commandParams: QueryCommandInput = {
      TableName: process.env.DYNAMO_MAIN_TABLE_NAME!,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: {
        ":PkeyValue": { S: params.primaryKey },
        ":SkeyValue": { S: params.sortKey }
      }
    }
    if (params.index?.indexName) {
      commandParams.IndexName = params.index!.indexName!;
    }

    const response = await this.client.send(new QueryCommand(commandParams));
    if (response.Items!.length === 0) {
      return null;
    }
    if (response.Items!.length > 1) {
      return new Error("Found more than 1 user when there should not be");
    }

    if (params.denormalize === true) {
      return this.serializer.deserialize(this.itemType, response.Items![0].data.S!);
    }

    return this.serializer.plainJsonToClass(this.itemType, unmarshall(response.Items![0]));
  }

  async getItemsByCompositeKey(params: {
    primaryKey: string,
    sortKey: string,
    shouldPartialMatchSortKey: boolean,
    index?: DynamoDbIndex,
    paginationToken?: Record<string, AttributeValue>,
    queryLimit?: number,
    denormalize?: boolean,
  }): Promise<PaginatedResponse<T[]>> {

    let partitionKeyName;
    let sortKeyName;

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

    if (params.index?.indexName) {
      commandParams.IndexName = params.index!.indexName!;
    }

    if (params.paginationToken) {
      commandParams.ExclusiveStartKey = params.paginationToken;
    }
    if (params.queryLimit) {
      commandParams.Limit = params.queryLimit;
    }

    const dynamoResponse = await this.client.send(new QueryCommand(commandParams));
    const paginatedResponse = new PaginatedResponse<T[]>([]);
    paginatedResponse.paginationToken = dynamoResponse.LastEvaluatedKey || null;
    if (dynamoResponse.Items!.length === 0) {
      return paginatedResponse;
    }

    paginatedResponse.data = dynamoResponse.Items!.map(item => {
      if (params.denormalize === true) {
        return this.serializer.deserialize(this.itemType, item.data.S!);
      }
      return this.serializer.plainJsonToClass(this.itemType, unmarshall(item));
    });

    return paginatedResponse;
  }

}