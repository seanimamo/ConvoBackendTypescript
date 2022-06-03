import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PostConfirmationTriggerEvent } from "aws-lambda";
import { createTables, deleteTables, startDb, stopDb } from "jest-dynalite";
import { PostConfirmationLambdaTrigger, postConfirmationLambdaTrigger_handleRequest } from "../../../../api/aws-lambda/cognito/PostConfirmationLambdaTrigger";
import { User } from "../../../../common/objects/user/User";
import { UserRepository } from "../../../../common/respositories/user/UserRepository";
import { getDummyUser } from "../../../util/DummyFactory";

let dynamoDBClient: DynamoDBClient;
let userRepository: UserRepository;
jest.setTimeout(10000);
beforeAll(async () => {
  await startDb();

  dynamoDBClient = new DynamoDBClient({
    region: "us-east-1",
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT
  });
  userRepository = new UserRepository(dynamoDBClient);
});

beforeEach(async () => {
  await createTables();
})

afterEach(async () => {
  await deleteTables();
})

afterAll(async () => {
  dynamoDBClient.destroy();
  await stopDb();
})

describe("Test PostConfirmationLambdaTrigger", () => {
  test("New Instance of Handler class can get user gets saved to dynamodb correctly from presignup event", async () => {
    const user = getDummyUser();
    user.isEmailValidated = false;
    await userRepository.save(user);

    const cognitoPostConfirmationEvent: PostConfirmationTriggerEvent = {
      version: '1',
      region: 'us-east-1',
      userPoolId: 'us-east-1_testUserPoolId',
      userName: user.username,
      callerContext: {
        awsSdkVersion: 'aws-sdk-unknown-unknown',
        clientId: "testClientId"
      },
      triggerSource: 'PostConfirmation_ConfirmSignUp',
      request: {
        userAttributes: {
          sub: "testsub",
          "email_verified": "true",
          "cognito:user_status" : "CONFIRMED",
          email: user.email
        }
      },
      response: {}
    }

    const handler = new PostConfirmationLambdaTrigger(dynamoDBClient);
    // @ts-ignore
    await handler.handleRequest(cognitoPostConfirmationEvent, null, (e: any, c: any) => { });
    const retrievedUser = await userRepository.getByUsername(cognitoPostConfirmationEvent.userName) as User;
    expect(retrievedUser).toBeDefined();
    expect(retrievedUser.isEmailValidated).toEqual(true);
  });

  test("Handler handleRequest function export can get user gets saved to dynamodb correctly from post confirmation event", async () => {
    const user = getDummyUser();
    user.isEmailValidated = false;
    await userRepository.save(user);

    const cognitoPostConfirmationEvent: PostConfirmationTriggerEvent = {
      version: '1',
      region: 'us-east-1',
      userPoolId: 'us-east-1_testUserPoolId',
      userName: user.username,
      callerContext: {
        awsSdkVersion: 'aws-sdk-unknown-unknown',
        clientId: "testClientId"
      },
      triggerSource: 'PostConfirmation_ConfirmSignUp',
      request: {
        userAttributes: {
          sub: "testsub",
          "email_verified": "true",
          "cognito:user_status" : "CONFIRMED",
          email: user.email
        }
      },
      response: {}
    }

    // @ts-ignore
    await postConfirmationLambdaTrigger_handleRequest(cognitoPostConfirmationEvent, null, (e: any, c: any) => { });
    const retrievedUser = await userRepository.getByUsername(cognitoPostConfirmationEvent.userName) as User;
    expect(retrievedUser).toBeDefined();
    expect(retrievedUser.isEmailValidated).toEqual(true);
  });

});