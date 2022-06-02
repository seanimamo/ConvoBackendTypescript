import { ConditionalCheckFailedException, DynamoDBClient, PutItemCommand, PutItemCommandInput, QueryCommand, QueryCommandInput, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { DynamoDBStack } from "../../aws-cdk/stacks/dynamodb-stack";
import { Stage } from "../../aws-cdk/Stage";
import { createStageBasedId } from "../../aws-cdk/util/cdkUtils";
import { ClassSerializer } from "../objects/ClassSerializer";
import { User } from "../objects/user/User";
import { ObjectAlreadyExistsError } from "./error/ObjectAlreadyExistsError";
import { ObjectDoesNotExistError } from "./error/ObjectDoesNotExistError";

export class UserRepository {
    #client: DynamoDBClient;
    #tableName = createStageBasedId(Stage.BETA, "ConvoMainTable");
    static userIdentifier = "USR";
    #serializer: ClassSerializer;

    createPartitionkey = (user: User) => {
        return user.username;
    }

    createSortkey = (user: User) => {
        return [
            UserRepository.userIdentifier,
            user.followerCount
        ].join('_');
    }

    constructor(client: DynamoDBClient) {
        this.#client = client;
        this.#serializer = new ClassSerializer();
    }

    async save(user: User) {
        const serializedUser = this.#serializer.classToPlainJson(user);

        const params: PutItemCommandInput = {
            TableName: this.#tableName,
            Item: marshall(serializedUser),
            ConditionExpression: `attribute_not_exists(${DynamoDBStack.PARTITION_KEY}) and attribute_not_exists(${DynamoDBStack.SORT_KEY})`
        }

        params.Item![DynamoDBStack.PARTITION_KEY] = { S: this.createPartitionkey(user) }
        params.Item![DynamoDBStack.SORT_KEY] = { S: this.createSortkey(user) }

        try {
            return await this.#client.send(new PutItemCommand(params));
        } catch (error) {
            if (error instanceof ConditionalCheckFailedException) {
                throw new ObjectAlreadyExistsError(error.message);
            }
        }
    }

    async getByUsername(username: string) {
        const params: QueryCommandInput = {
            TableName: this.#tableName,
            KeyConditionExpression: `${DynamoDBStack.PARTITION_KEY} = :PkeyValue and begins_with(${DynamoDBStack.SORT_KEY}, :SkeyValue)`,
            ExpressionAttributeValues: {
                ":PkeyValue": { S: username },
                ":SkeyValue": { S: UserRepository.userIdentifier }
            }
        }
        const response = await this.#client.send(new QueryCommand(params));
        if (response.Items!.length === 0) {
            return null;
        }
        if (response.Items!.length > 1) {
            return new Error("Found more than 1 user when there should not be");
        }
        return this.#serializer.plainJsonToClass(User, unmarshall(response.Items![0]));
    }

    async updateIsEmailValidated(username: string, isEmailValidated: boolean) {
        let user = await this.getByUsername(username) as User | null;
        if (user === null) {
            throw new ObjectDoesNotExistError("User does not exist");
        }
        const params: UpdateItemCommandInput = {
            TableName: this.#tableName,
            Key: {
                [DynamoDBStack.PARTITION_KEY]: { S: user.username },
                [DynamoDBStack.SORT_KEY]: { S: this.createSortkey(user) }
            },
            UpdateExpression: `SET isEmailValidated = :isEmailValidated`,
            ExpressionAttributeValues: {
                ":isEmailValidated": { BOOL: isEmailValidated },
            }
        }
        return await this.#client.send(new UpdateItemCommand(params));
    }
}