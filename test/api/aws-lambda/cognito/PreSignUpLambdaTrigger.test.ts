import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PreSignUpEmailTriggerEvent } from "aws-lambda";
import { createTables, deleteTables, startDb, stopDb } from "jest-dynalite";
import { PreSignUpLambdaTrigger } from "../../../../api/aws-lambda/cognito/PreSignUpLambdaTrigger";
import { User } from "../../../../common/objects/user/User";
import { EmailAlreadyInUseError, UsernameAlreadyInUseError } from "../../../../common/respositories/user/error";
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

describe("Test PreSignUpLambdaTrigger", () => {
  test("Attempt to create new user sucessfully saves new user to dynamodb correctly from pre signup event", async () => {
    const cognitoPreSignupTriggerEvent: PreSignUpEmailTriggerEvent = {
      version: '1',
      region: 'us-east-1',
      userPoolId: 'us-east-1_testUserPoolId',
      userName: 'acambooty',
      callerContext: {
        awsSdkVersion: 'aws-sdk-unknown-unknown',
        clientId: "testClientId"
      },
      triggerSource: 'PreSignUp_SignUp',
      request: {
        userAttributes: {
          'custom:firstName': 'Victoria',
          'custom:lastName': 'Acampora',
          email: 'victoriasemail@test.com'
        },
        clientMetadata: {
          rawPassword: 'testPassword',
          hideRealName: 'true',
        }
      },
      response: {
        autoConfirmUser: false,
        autoVerifyEmail: false,
        autoVerifyPhone: false
      }
    }

    console.log(JSON.stringify(cognitoPreSignupTriggerEvent))

    const handler = new PreSignUpLambdaTrigger(dynamoDBClient);
    // @ts-ignore
    await handler.handleRequest(cognitoPreSignupTriggerEvent, null, (e: any, c: any) => { });

    const user = await userRepository.getByUsername(cognitoPreSignupTriggerEvent.userName) as User;
    expect(user).toBeDefined();
    expect(user.username).toEqual(cognitoPreSignupTriggerEvent.userName);
    expect(user.password.isPasswordCorrect(cognitoPreSignupTriggerEvent.request.clientMetadata!['rawPassword'])).toEqual(true);
    expect(user.settings.hideRealName).toEqual(cognitoPreSignupTriggerEvent.request.clientMetadata!['hideRealName'] === 'true');
    expect(user.firstName).toEqual(cognitoPreSignupTriggerEvent.request.userAttributes['custom:firstName']);
    expect(user.lastName).toEqual(cognitoPreSignupTriggerEvent.request.userAttributes['custom:lastName']);
    expect(user.email).toEqual(cognitoPreSignupTriggerEvent.request.userAttributes['email']);
  });

  test("Attempt to create user with prexisting username fails", async () => {
    const user = getDummyUser();
    await userRepository.save(user);

    const cognitoPreSignupTriggerEvent: PreSignUpEmailTriggerEvent = {
      version: '1',
      region: 'us-east-1',
      userPoolId: 'us-east-1_testUserPoolId',
      userName: user.username,
      callerContext: {
        awsSdkVersion: 'aws-sdk-unknown-unknown',
        clientId: "testClientId"
      },
      triggerSource: 'PreSignUp_SignUp',
      request: {
        userAttributes: {
          'custom:firstName': 'Victoria',
          'custom:lastName': 'Acampora',
          email: 'aDifferentEmaillll@test.com'
        },
        clientMetadata: {
          rawPassword: 'testPassword',
          hideRealName: 'true',
        }
      },
      response: {
        autoConfirmUser: false,
        autoVerifyEmail: false,
        autoVerifyPhone: false
      }
    }

    const handler = new PreSignUpLambdaTrigger(dynamoDBClient);
    // @ts-ignore
    await expect(handler.handleRequest(cognitoPreSignupTriggerEvent, null, (e: any, c: any) => { })).rejects.toThrow(UsernameAlreadyInUseError);
  });

  test("Attempt to create user with prexisting email fails", async () => {
    const user = getDummyUser();
    await userRepository.save(user);

    const cognitoPreSignupTriggerEvent: PreSignUpEmailTriggerEvent = {
      version: '1',
      region: 'us-east-1',
      userPoolId: 'us-east-1_testUserPoolId',
      userName: user.username + 'uniqueString',
      callerContext: {
        awsSdkVersion: 'aws-sdk-unknown-unknown',
        clientId: "testClientId"
      },
      triggerSource: 'PreSignUp_SignUp',
      request: {
        userAttributes: {
          'custom:firstName': 'Victoria',
          'custom:lastName': 'Acampora',
          email: user.email
        },
        clientMetadata: {
          rawPassword: 'testPassword',
          hideRealName: 'true',
        }
      },
      response: {
        autoConfirmUser: false,
        autoVerifyEmail: false,
        autoVerifyPhone: false
      }
    }

    const handler = new PreSignUpLambdaTrigger(dynamoDBClient);
    // @ts-ignore
    await expect(handler.handleRequest(cognitoPreSignupTriggerEvent, null, (e: any, c: any) => { })).rejects.toThrow(EmailAlreadyInUseError);
  });

  test("Attempt to create user with prexisting username and email fails", async () => {
    const user = getDummyUser();
    await userRepository.save(user);

    const cognitoPreSignupTriggerEvent: PreSignUpEmailTriggerEvent = {
      version: '1',
      region: 'us-east-1',
      userPoolId: 'us-east-1_testUserPoolId',
      userName: user.username,
      callerContext: {
        awsSdkVersion: 'aws-sdk-unknown-unknown',
        clientId: "testClientId"
      },
      triggerSource: 'PreSignUp_SignUp',
      request: {
        userAttributes: {
          'custom:firstName': 'Victoria',
          'custom:lastName': 'Acampora',
          email: user.email
        },
        clientMetadata: {
          rawPassword: 'testPassword',
          hideRealName: 'true',
        }
      },
      response: {
        autoConfirmUser: false,
        autoVerifyEmail: false,
        autoVerifyPhone: false
      }
    }

    const handler = new PreSignUpLambdaTrigger(dynamoDBClient);
    // @ts-ignore
    await expect(handler.handleRequest(cognitoPreSignupTriggerEvent, null, (e: any, c: any) => { })).rejects.toThrow(EmailAlreadyInUseError);
  });
});