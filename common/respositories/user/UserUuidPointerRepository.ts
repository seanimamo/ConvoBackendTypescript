import { ConditionalCheckFailedException, DynamoDBClient, PutItemCommand, PutItemCommandInput, QueryCommand, QueryCommandInput, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBStack } from "../../../aws-cdk/stacks/dynamodb-stack";
import { ClassSerializer } from "../../objects/ClassSerializer";
import { UserUuidPointer } from "../../objects/user/UserUuidPointer";
import { UniqueObjectAlreadyExistsError } from "../error/UniqueObjectAlreadyExistsError";
import 'dotenv/config';

export class UserUuidPointerRepository {
  static UserUuidPointerIdentifier = "USER_UUID_POINTER";
  #client: DynamoDBClient;
  #primaryTableName: string;
  #serializer: ClassSerializer;

  createPartitionkey = (emailPointer: UserUuidPointer) => {
    return emailPointer.email;
  }

  createSortkey = (emailPointer: UserUuidPointer) => {
    return [
      UserUuidPointerRepository.UserUuidPointerIdentifier,
      emailPointer.accountType
    ].join('_');
  }

  constructor(client: DynamoDBClient) {
    this.#client = client;
    this.#serializer = new ClassSerializer();
    this.#primaryTableName = process.env.DYNAMO_MAIN_TABLE_NAME!;
  }

  async save(uuidPointer: UserUuidPointer) {
    UserUuidPointer.validate(uuidPointer);
    const serializedPointer = this.#serializer.classToPlainJson(uuidPointer);
    const params: PutItemCommandInput = {
      TableName: this.#primaryTableName,
      Item: marshall(serializedPointer),
      ConditionExpression: `attribute_not_exists(${DynamoDBStack.PARTITION_KEY}) and attribute_not_exists(${DynamoDBStack.SORT_KEY})`
    }
    params.Item![DynamoDBStack.PARTITION_KEY] = { S: this.createPartitionkey(uuidPointer) }
    params.Item![DynamoDBStack.SORT_KEY] = { S: this.createSortkey(uuidPointer) }

    try {
      return await this.#client.send(new PutItemCommand(params));
    } catch (error) {
      if (error instanceof ConditionalCheckFailedException) {
        throw new UniqueObjectAlreadyExistsError("User Uuid pointer already exists");
      }
    }
  }

  async getByEmail(email: string) {
    const params: QueryCommandInput = {
      TableName: this.#primaryTableName,
      KeyConditionExpression: `${DynamoDBStack.PARTITION_KEY} = :PkeyValue and begins_with(${DynamoDBStack.SORT_KEY}, :SkeyValue)`,
      ExpressionAttributeValues: {
        ":PkeyValue": { S: email },
        ":SkeyValue": { S: UserUuidPointerRepository.UserUuidPointerIdentifier }
      }
    }
    const response = await this.#client.send(new QueryCommand(params));
    if (response.Items!.length === 0) {
      return null;
    }
    if (response.Items!.length > 1) {
      return new Error("Found more than 1 user uuid pointer when there should not be");
    }
    return this.#serializer.plainJsonToClass(UserUuidPointer, unmarshall(response.Items![0]));
  }
}