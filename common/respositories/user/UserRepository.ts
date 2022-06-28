import { DynamoDBClient, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { User } from "../../objects/user/User";
import { UserAccountType, UserUuidPointer } from "../../objects/user/UserUuidPointer";
import { EmailAlreadyInUseError, UsernameAlreadyInUseError } from "./error";
import { UserUuidPointerRepository } from "./UserUuidPointerRepository";
import { Repository } from "../Repository";
import "dotenv/config";
import { ObjectDoesNotExistError, UniqueObjectAlreadyExistsError } from "../error";
import { DYNAMODB_INDEXES } from "../DynamoDBConstants";

export class UserRepository extends Repository<User> {
    static objectIdentifier = "USER";
    #client: DynamoDBClient;
    #userUuidPointerRepo: UserUuidPointerRepository;

    createPartitionKey = (user: User) => {
        return user.userName;
    }

    createSortKey = (user: User) => {
        return [
            UserRepository.objectIdentifier,
            user.metrics.followerCount
        ].join(Repository.compositeKeyDelimeter);
    }

    constructor(client: DynamoDBClient) {
        super(client, User);
        this.#client = client;
        this.#userUuidPointerRepo = new UserUuidPointerRepository(client);
    }

    async save(user: User) {
        User.validate(user);
        try {
            // In the future with OAuth logins, we will utilize other account types.
            await this.#userUuidPointerRepo.save(
                UserUuidPointer.fromUser(user, UserAccountType.CONVO)
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

    async getByUsername(userName: string) {
        return await super.getUniqueItemByCompositeKey({
            primaryKey: userName,
            sortKey: {
                value: UserRepository.objectIdentifier,
                conditionExpressionType: "BEGINS_WITH",
            },
        });
    }

    async updateIsEmailValidated(userName: string, isEmailValidated: boolean) {
        let user = await this.getByUsername(userName) as User | null;
        if (user === null) {
            throw new ObjectDoesNotExistError("User does not exist");
        }
        const params: UpdateItemCommandInput = {
            TableName: process.env.DYNAMO_MAIN_TABLE_NAME!,
            Key: {
                [DYNAMODB_INDEXES.PRIMARY.partitionKeyName]: { S: user.userName },
                [DYNAMODB_INDEXES.PRIMARY.sortKeyName]: { S: this.createSortKey(user) }
            },
            UpdateExpression: `SET isEmailValidated = :isEmailValidated`,
            ExpressionAttributeValues: {
                ":isEmailValidated": { BOOL: isEmailValidated },
            }
        }
        return await this.#client.send(new UpdateItemCommand(params));
    }
}