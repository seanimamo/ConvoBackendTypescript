import { DynamoDBClient, GetItemCommand, GetItemCommandInput, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { Stage } from "../../aws-cdk/Stage";
import { createStageBasedId } from "../../aws-cdk/util/cdkUtils";
import { ClassSerializer } from "../objects/ClassSerializer";
import { User } from "../objects/user/User";
import { UserPassword } from "../objects/user/UserPassword";

export class UserRepository {
    #client: DynamoDBClient;
    #tableName = createStageBasedId(Stage.BETA, "ConvoMainTable");
    #serializer: ClassSerializer;


    constructor(client: DynamoDBClient) {
        this.#client = client;
        this.#serializer = new ClassSerializer();
    }

    async save(user: User) {
        const serializedUser = this.#serializer.classToPlainJson(user);

        const params: PutItemCommandInput = {
            TableName: this.#tableName,
            Item: marshall(serializedUser),
            ConditionExpression: 'attribute_not_exists(PKEY)'
        }

        params.Item!["PKEY"] = { S: user.username }

        const response = await this.#client.send(new PutItemCommand(params));
        return response;
    }

    async getByUsername(username: string) {
        const params: GetItemCommandInput = {
            TableName: this.#tableName,
            Key: {
                'PKEY': { S: username }
            }
        }
        return await this.#client.send(new GetItemCommand(params));;
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