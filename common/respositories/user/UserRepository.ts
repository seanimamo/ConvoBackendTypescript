import { AttributeValue, ConditionalCheckFailedException, DynamoDBClient, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { User, UserId, UserSettings } from "../../objects/user/User";
import { UserAccountType, UserIdPointer, UserIdPointerId } from "../../objects/user/UserIdPointer";
import { EmailAlreadyInUseError, UsernameAlreadyInUseError } from "./error";
import { UserIdPointerRepository } from "./UserIdPointerRepository";
import { Repository } from "../Repository";
import "dotenv/config";
import { InvalidParametersError, ObjectDoesNotExistError, UniqueObjectAlreadyExistsError } from "../error";
import { DYNAMODB_INDEXES } from "../DynamoDBConstants";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export class UserRepository extends Repository<User> {
    #client: DynamoDBClient;
    #userUuidPointerRepo: UserIdPointerRepository;

    createPartitionKey = (user: User) => {
        return user.id.getValue();
    }

    createSortKey = (user: User) => {
        return user.id.getValue();
    }

    constructor(client: DynamoDBClient) {
        super(client, User);
        this.#client = client;
        this.#userUuidPointerRepo = new UserIdPointerRepository(client);
    }

    async save(user: User) {
        User.validate(user);
        try {
            // In the future with OAuth logins, we will utilize other account types.
            await this.#userUuidPointerRepo.save(
                UserIdPointer.fromUser(user, UserAccountType.CONVO)
            );
        } catch (error) {
            if (error instanceof UniqueObjectAlreadyExistsError) {
                throw new EmailAlreadyInUseError();
            }
            throw error;
        }

        try {
            return await super.saveItem({ object: user, checkForExistingKey: "PRIMARY" });
        } catch (error) {
            // This will throw a UniqueObjectAlreadyExistsError if the username is already in use.
            if (error instanceof UniqueObjectAlreadyExistsError) {
                throw new UsernameAlreadyInUseError();
            }
            throw error;
        }
    }

    async getById(id: UserId) {
        return await super.getUniqueItemByCompositeKey({
            primaryKey: id.getValue(),
            sortKey: {
                value: UserId.IDENTIFIER,
                conditionExpressionType: "BEGINS_WITH",
            },
        });
    }

    async getByUsername(userName: string) {
        return await this.getById(new UserId({ userName }));
    }

    async updateIsEmailValidated(userName: string, isEmailValidated: boolean) {
        const userId = new UserId({ userName });
        const params: UpdateItemCommandInput = {
            TableName: process.env.DYNAMO_MAIN_TABLE_NAME!,
            Key: {
                [DYNAMODB_INDEXES.PRIMARY.partitionKeyName]: { S: userId.getValue() },
                [DYNAMODB_INDEXES.PRIMARY.sortKeyName]: { S: userId.getValue() }
            },
            UpdateExpression: `SET isEmailValidated = :isEmailValidated`,
            ExpressionAttributeValues: {
                ":isEmailValidated": { BOOL: isEmailValidated },
            },
            ConditionExpression: `attribute_exists(${DYNAMODB_INDEXES.PRIMARY.partitionKeyName})
             and attribute_exists(${DYNAMODB_INDEXES.PRIMARY.sortKeyName})`
        }

        try {
            return await this.#client.send(new UpdateItemCommand(params));
        } catch (e) {
            if (e instanceof ConditionalCheckFailedException) {
                throw new ObjectDoesNotExistError("User does not exist");
            }
            throw e;
        }
    }

    async updateProfile(params: {
        userName: string,
        firstName?: string,
        lastName?: string,
        thumbnail?: string,
        bio?: string,
        location?: string,
        profession?: string,
        settings?: UserSettings
    }) {
        const updateExpressionCommands = [];
        let expressionNames = undefined;
        let expressionAttributeValues: Record<string, AttributeValue> = {};
        if (params.firstName) {
            updateExpressionCommands.push(`firstName = :firstName`);
            expressionAttributeValues[':firstName'] = { S: params.firstName }
        }
        if (params.lastName) {
            updateExpressionCommands.push(`lastName = :lastName`);
            expressionAttributeValues[':lastName'] = { S: params.lastName }
        }
        if (params.thumbnail) {
            updateExpressionCommands.push(`thumbnail = :thumbnail`);
            expressionAttributeValues[':thumbnail'] = { S: params.thumbnail }
        }
        if (params.bio) {
            updateExpressionCommands.push(`bio = :bio`);
            expressionAttributeValues[':bio'] = { S: params.bio }
        }
        if (params.location) {
            updateExpressionCommands.push(`#locationKey = :locationVal`);
            expressionAttributeValues[':locationVal'] = { S: params.location }
            expressionNames = {
                '#locationKey': 'location'
            }
        }
        if (params.profession) {
            updateExpressionCommands.push(`profession = :profession`);
            expressionAttributeValues[':profession'] = { S: params.profession }
        }
        if (params.settings) {
            updateExpressionCommands.push(`settings = :settings`);
            expressionAttributeValues[':settings'] = { M: marshall(params.settings) };
        }

        const updateExpression = this.updateItemExpressionBuilder(updateExpressionCommands);
        if (updateExpression === null) {
            throw new InvalidParametersError();
        }
        const userId = new UserId({ userName: params.userName })
        const updateParams: UpdateItemCommandInput = {
            TableName: process.env.DYNAMO_MAIN_TABLE_NAME!,
            Key: {
                [DYNAMODB_INDEXES.PRIMARY.partitionKeyName]: { S: userId.getValue() },
                [DYNAMODB_INDEXES.PRIMARY.sortKeyName]: { S: userId.getValue() }
            },
            ConditionExpression: `attribute_exists(${DYNAMODB_INDEXES.PRIMARY.partitionKeyName})
            and attribute_exists(${DYNAMODB_INDEXES.PRIMARY.sortKeyName})`,
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionNames,
            ReturnValues: "ALL_NEW"
        }

        try {
            const response = await this.#client.send(new UpdateItemCommand(updateParams));
            return this.serializer.plainJsonToClass(this.itemType, unmarshall(response.Attributes!))
        } catch (e) {
            if (e instanceof ConditionalCheckFailedException) {
                throw new ObjectDoesNotExistError("User does not exist");
            }
            throw e;
        }
    }


}