import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Context, PreSignUpTriggerEvent, PreSignUpTriggerHandler } from "aws-lambda";
import { User } from "../../../common/objects/user/User";
import { UserBanStatus, UserBanType } from "../../../common/objects/user/UserBanStatus";
import { UserPassword } from "../../../common/objects/user/UserPassword";
import { UniqueObjectAlreadyExistsError } from "../../../common/respositories/error";
import { UserRepository } from "../../../common/respositories/user/UserRepository";
import { DataValidationError, DataValidator, InvalidDataTypeError } from '../../../common/util/DataValidator';
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
        new DynamoDBClient({
          region: "us-east-1",
        })
      );
    }
    else {
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
      if (error instanceof InvalidDataTypeError || error instanceof DataValidationError) {
        throw new InvalidRequestException(`Request has one or more missing or invalid attributes: ${error.message}`);
      }
    }

    const userName = event.userName;
    const email = event.request.userAttributes['email'];
    const rawPassword = event.request.clientMetadata!['rawPassword'];
    const firstName = event.request.userAttributes['custom:firstName'];
    const lastName = event.request.userAttributes['custom:lastName'];
    const hideRealName = event.request.clientMetadata!['hideRealName'] === 'true'; // converts string to boolean.



    const user = User.builder({
      userName: userName,
      password: UserPassword.fromPlainTextPassword(rawPassword),
      email: email,
      isEmailValidated: false,
      firstName: firstName,
      lastName: lastName,
      joinDate: new Date(),
      banStatus: {
        type: UserBanType.NONE
      },
      metrics: {
        convoScore: 0,
        followerCount: 0,
        followingCount: 0,
      },
      settings: {
        hideRealName: hideRealName
      }
    });
    await this.userRepository.save(user);

    console.log(`successfully created and saved new user ${userName}`)

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
const preSignUpLambdaTrigger = new PreSignUpLambdaTrigger();
export const preSignUpLambdaTrigger_handleRequest = preSignUpLambdaTrigger.handleRequest.bind(preSignUpLambdaTrigger);