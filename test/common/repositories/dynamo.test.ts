
import { DynamoDB } from "aws-sdk";
import { Stage } from "../../../aws-cdk/Stage";
import { createStageBasedId } from "../../../aws-cdk/util/cdkUtils";
import { User } from "../../../common/objects/user/User";
import { UserPassword } from "../../../common/objects/user/UserPassword";
import { UserRepository } from "../../../common/respositories/UserRepository";
const DynamoDbLocal = require('dynamodb-local');
const dynamoLocalPort = 8000;

// const isTest = process.env.JEST_WORKER_ID;
// const config = {
//   convertEmptyValues: true,
//   ...(isTest && {
//     endpoint: 'localhost:8000',
//     sslEnabled: false,
//     region: 'local-env',
//   }),
// };

// const dynamodb = new DynamoDB({
//   region: "local",
//   endpoint: "http://localhost:8000"
// });

// afterAll(() => {
//   dynamodb.destroy
// });

// describe("Test Dy7namo", () => {

//   test("Check that transforming the class to and from plain json does not change any data", async () => {
//     const respo = await dynamodb.listTables();
//     console.log("respo", respo);
//   });



// });

//@ts-ignore
let childProcess;
let dynamodb: DynamoDB;

DynamoDbLocal.configureInstaller({
  installPath: './dynamodblocal-bin',
  downloadUrl: 'https://s3.eu-central-1.amazonaws.com/dynamodb-local-frankfurt/dynamodb_local_latest.tar.gz'
});

beforeAll(async () => {
  childProcess = await DynamoDbLocal.launch(dynamoLocalPort, null, [], false, true);
  console.log("Started dynamo locally");

  dynamodb = new DynamoDB({
    region: "us-east-1",
    endpoint: "http://localhost:8000"
  });

  const params = {
    TableName: createStageBasedId(Stage.BETA, "ConvoMainTable"),
    KeySchema: [
      { AttributeName: "PKEY", KeyType: "HASH" },  //Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: "PKEY", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  const resp = await dynamodb.createTable(params).promise();
  console.log("created table, response: ", resp)
});

afterAll(async () => {
  //@ts-ignore
  await DynamoDbLocal.stopChild(childProcess);
})


describe("Test Dynamo", () => {
  test("Test querying local dynamodb table", async () => {
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

    const userRepository = new UserRepository(dynamodb);

    try {
      const response = await userRepository.save(user);
      console.log("Successful save", response);
    } catch (error) {
      console.log("failed to save", error);
    }

    try {
      const response = await userRepository.getByUsername(user.username);
      console.log("Successful get: ", response);
    } catch (error) {
      console.log("failed to get: ", error);
    }
 
  });
});