import { ConditionalCheckFailedException, DynamoDBClient, PutItemCommand, PutItemCommandInput, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ClassConstructor } from "class-transformer";
import { ClassSerializer } from "../objects/ClassSerializer";
import { DynamoDBKeyNames } from "./DynamoDBConstants";
import { UniqueObjectAlreadyExistsError } from "./error/UniqueObjectAlreadyExistsError";
import "dotenv/config";

export abstract class Repository<T> {

  primaryTableName: string;
  client: DynamoDBClient;
  serializer: ClassSerializer;
  itemType: ClassConstructor<T>;

  constructor(client: DynamoDBClient, itemType: ClassConstructor<T>) {
    this.client = client;
    this.serializer = new ClassSerializer();
    this.primaryTableName = process.env.DYNAMO_MAIN_TABLE_NAME!;
    this.itemType = itemType;
  }

  abstract createPartitionKey(object: T): string;
  abstract createSortKey(object: T): string;

  // Saves an item and fails if an object with the same pkey and skey already exist.
  async saveItem(params: {
    object: T,
    checkForExistingCompositeKey: boolean,
  }) {

    const serializedUser = this.serializer.classToPlainJson(params.object);
    const commandParams: PutItemCommandInput = {
      TableName: this.primaryTableName,
      Item: marshall(serializedUser),
    }

    if (params.checkForExistingCompositeKey) {
      commandParams.ConditionExpression = `attribute_not_exists(${DynamoDBKeyNames.PARTITION_KEY}) and attribute_not_exists(${DynamoDBKeyNames.SORT_KEY})`
    }

    commandParams.Item![DynamoDBKeyNames.PARTITION_KEY] = { S: this.createPartitionKey(params.object) }
    commandParams.Item![DynamoDBKeyNames.SORT_KEY] = { S: this.createSortKey(params.object) }

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
    shouldPartialMatchSortKey: boolean
  }) {

    let keyConditionExpression = `${DynamoDBKeyNames.PARTITION_KEY} = :PkeyValue`;
    if (params.shouldPartialMatchSortKey) {
      keyConditionExpression += ` and begins_with(${DynamoDBKeyNames.SORT_KEY}, :SkeyValue)`;
    } else {
      keyConditionExpression += ` and ${DynamoDBKeyNames.SORT_KEY} = :SkeyValue)`;
    }

    const commandParams: QueryCommandInput = {
      TableName: this.primaryTableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: {
        ":PkeyValue": { S: params.primaryKey },
        ":SkeyValue": { S: params.sortKey }
      }
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

}