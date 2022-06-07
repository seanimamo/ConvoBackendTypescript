import { DynamoDBClient, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { User } from "../../objects/user/User";
import { UserAccountType, UserUuidPointer } from "../../objects/user/UserUuidPointer";
import { UniqueObjectAlreadyExistsError } from "../error/UniqueObjectAlreadyExistsError";
import { ObjectDoesNotExistError } from "../error/ObjectDoesNotExistError";
import { EmailAlreadyInUseError, UsernameAlreadyInUseError } from "./error";
import { UserUuidPointerRepository } from "./UserUuidPointerRepository";
import { DynamoDBKeyNames } from "../DynamoDBConstants";
import { Repository } from "../Repository";
import "dotenv/config";

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
            user.followerCount
        ].join('_');
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
        }

        const existingUser = await this.getByUsername(user.userName);
        if (existingUser !== null) {
            throw new UsernameAlreadyInUseError();
        }

        return await super.saveItem({ object: user, checkForExistingCompositeKey: false });
    }

    async getByUsername(userName: string) {
        return await super.getUniqueItemByCompositeKey({
            primaryKey: userName,
            sortKey: UserRepository.objectIdentifier,
            shouldPartialMatchSortKey: true
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
                [DynamoDBKeyNames.PARTITION_KEY]: { S: user.userName },
                [DynamoDBKeyNames.SORT_KEY]: { S: this.createSortKey(user) }
            },
            UpdateExpression: `SET isEmailValidated = :isEmailValidated`,
            ExpressionAttributeValues: {
                ":isEmailValidated": { BOOL: isEmailValidated },
            }
        }
        return await this.#client.send(new UpdateItemCommand(params));
    }
}