import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Context, PreSignUpTriggerEvent, PreSignUpTriggerHandler } from "aws-lambda"
import { User } from "../../../common/objects/user/User";
import { UserPassword } from "../../../common/objects/user/UserPassword";
import { UserRepository } from "../../../common/respositories/user/UserRepository";
import { DataValidator, InvalidDataTypeError } from '../../../common/util/DataValidator';
import { InvalidRequestException } from "../../error";

/**
 * Cognito pre sign up hook that replicates a user into a Convo dynamodb table.
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html
 * @see https://blog.10pines.com/2019/07/23/writing-object-oriented-typescript-code-for-aws-lambda/
 */
export class PreSignUpLambdaTrigger {
  dataValidator: DataValidator
  userRepository: UserRepository;

  // dynamoDBClient should only be passed in for testing purposes
  constructor(dynamoDBClient?: DynamoDBClient) {
    this.dataValidator = new DataValidator();
    if (!dynamoDBClient) {
      this.userRepository = new UserRepository(
        // TODO: replace with actual client configuration.
        new DynamoDBClient({
          region: "us-east-1",
          endpoint: process.env.MOCK_DYNAMODB_ENDPOINT
        })
      );
    } else {
      this.userRepository = new UserRepository(dynamoDBClient);
    }
  }

  handleRequest: PreSignUpTriggerHandler = async (event: PreSignUpTriggerEvent, context: Context, callback) => {
    const loggedEvent = { ...event };
    loggedEvent.request.clientMetadata!['rawPassword'] = '***';
    console.log("recieved pre sign up event: ", loggedEvent);

    // Validate request object
    try {
      this.dataValidator.validate(event.request.userAttributes['email'], 'userAttributes.email').notUndefined().notNull().isString().notEmpty();
      this.dataValidator.validate(event.request.userAttributes['custom:firstName'], 'userAttributes[custom:firstName]').notUndefined().notNull().isString().notEmpty();
      this.dataValidator.validate(event.request.userAttributes['custom:lastName'], 'userAttributes[custom:lastName]').notUndefined().notNull().isString().notEmpty();
      this.dataValidator.validate(event.request.clientMetadata, 'clientMetadata').notUndefined().notNull();
      this.dataValidator.validate(event.request.clientMetadata!['rawPassword'], 'clientMetadata.rawPassword').notUndefined().notNull().isString().notEmpty()
      this.dataValidator.validate(event.request.clientMetadata!['hideRealName'], 'clientMetadata.hideRealName').notUndefined().notNull().isString().notEmpty().isBoolean();
    } catch (error) {
      if (error instanceof InvalidDataTypeError) {
        throw new InvalidRequestException(`Request has one or more missing or invalid attributes: ${error.message}`);
      }
    }

    const username = event.userName;
    const email = event.request.userAttributes['email'];
    const rawPassword = event.request.clientMetadata!['rawPassword'];
    const firstName = event.request.userAttributes['custom:firstName'];
    const lastName = event.request.userAttributes['custom:lastName'];
    const hideRealName = event.request.clientMetadata!['hideRealName'] === 'true'; // converts string to boolean.

    const user = User.builder({
      username: username,
      password: UserPassword.fromPlainTextPassword(rawPassword),
      email: email,
      isEmailValidated: false,
      firstName: firstName,
      lastName: lastName,
      joinDate: new Date(),
      birthDate: new Date(),
      convoScore: 0,
      followerCount: 0,
      followingCount: 0,
      settings: {
        hideRealName: hideRealName
      }
    });
    await this.userRepository.save(user);

    // Returns response to Amazon Cognito
    callback(null, event);
  }
}

/**
 * If you call an instance method inside a handler you’re likely to get an error like the one above. 
 * It is a well known side effect of passing functions as value.
 * Because they are being used in isolation through dynamic binding, they lose the calling context.
 * Luckily, this can be easily solved with context binding:
 */
export const preSignUpLambdaTrigger = new PreSignUpLambdaTrigger()
export const preSignUpLambdaTrigger_handleRequest = preSignUpLambdaTrigger.handleRequest.bind(preSignUpLambdaTrigger);