import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Context, PostConfirmationTriggerEvent, PostConfirmationTriggerHandler } from "aws-lambda";
import { ObjectDoesNotExistError } from "../../../common/respositories/error/ObjectDoesNotExistError";
import { UserRepository } from "../../../common/respositories/user/UserRepository";
import { DataValidator, InvalidDataTypeError } from '../../../common/util/DataValidator';
import { InvalidRequestException } from "../../error";

/**
 * Cognito post confirmation hook that replicates a user into a Convo dynamodb table.
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-pre-sign-up.html
 * @see https://blog.10pines.com/2019/07/23/writing-object-oriented-typescript-code-for-aws-lambda/
 */
export class PostConfirmationLambdaTrigger {
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
        })
      );
    } else {
      this.userRepository = new UserRepository(dynamoDBClient);
    }
  }

  handleRequest: PostConfirmationTriggerHandler = async (event: PostConfirmationTriggerEvent, context: Context, callback) => {
    console.log("Recieved post confirmation event: ", event);

    // Validate request object
    try {
      this.dataValidator.validate(event.request.userAttributes['email'], 'userAttributes.email').notUndefined().notNull().isString().notEmpty();
    } catch (error) {
      if (error instanceof InvalidDataTypeError) {
        throw new InvalidRequestException(`Request has one or more missing or invalid attributes: ${error.message}`);
      }
    }

    const isEmailVerified = event.request.userAttributes['email_verified'] === 'true';

    try {
      await this.userRepository.updateIsEmailValidated(event.userName, isEmailVerified);
    } catch (error) {
      if (error instanceof ObjectDoesNotExistError) {
        throw new InvalidRequestException('User does not exist');
      }
    }

    console.log(`Successfully confirmed user account: ${event.userName}`);

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
const postConfirmationLambdaTrigger = new PostConfirmationLambdaTrigger();
export const postConfirmationLambdaTrigger_handleRequest = postConfirmationLambdaTrigger.handleRequest.bind(postConfirmationLambdaTrigger);