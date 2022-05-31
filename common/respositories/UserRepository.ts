import { DynamoDB } from "aws-sdk";
import { Converter } from "aws-sdk/clients/dynamodb";
import { Stage } from "../../aws-cdk/Stage";
import { createStageBasedId } from "../../aws-cdk/util/cdkUtils";
import { ClassSerializer } from "../objects/ClassSerializer";
import { User } from "../objects/user/User";
import { UserPassword } from "../objects/user/UserPassword";

export class UserRepository {
    #client: DynamoDB;
    #tableName = createStageBasedId(Stage.BETA, "ConvoMainTable");
    #serializer: ClassSerializer;


    constructor(client: DynamoDB) {
        this.#client = client;
        this.#serializer = new ClassSerializer();
    }

    async save(user: User) {
        const serializedUser = this.#serializer.classToPlainJson(user);

        const params: DynamoDB.PutItemInput = {
            TableName: this.#tableName,
            Item: Converter.marshall(serializedUser),
            ReturnValues: 'ALL_OLD',
        }

        params.Item["PKEY"] = { S: user.username }

        const response = await this.#client.putItem(params).promise();
        return response;
    }

    async getByUsername(username: string) {
        const params: DynamoDB.GetItemInput = {
            TableName: this.#tableName,
            Key: {
                'PKEY': { S: username }
            }
        }

        return await this.#client.getItem(params).promise();
    }


}

const user: User = User.builder({
    username: "string",
    accountType: "CONVO",
    password: UserPassword.fromPlainTextPassword('test'),
    email: "string",
    isEmaiValidated: true,
    firstName: "string",
    lastName: "string",
    joinDate: new Date("2022-01-01").toUTCString(),
    thumbnail: "string",
    bio: "string",
    occupation: "string",
    convoScore: 0,
    followerCount: 0,
    followingCount: 0,
    settings: {
        hideRealName: false
    }
});

// const serializer = new ClassSerializer();

// const serializedUser = serializer.classToPlainJson(user);

// console.log(JSON.stringify(Converter.marshall(serializedUser)));