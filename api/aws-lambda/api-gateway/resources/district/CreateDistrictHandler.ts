import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context, Handler, } from "aws-lambda";
import { District } from "../../../../../common/objects/District";
import { ViewMode } from "../../../../../common/objects/enums";
import { ObjectBanType } from "../../../../../common/objects/ObjectBanStatus";
import { DistrictRepository } from "../../../../../common/respositories/district/DistrictRepository";
import { UserRepository } from "../../../../../common/respositories/user/UserRepository";
import { ClassSerializer } from "../../../../../common/util/ClassSerializer";
import { DataValidationError, DataValidator } from "../../../../../common/util/DataValidator";
import { InvalidRequestException } from "../../../../error";
import { CreateDistrictRequest } from "../../../../model/resources/district/CreateDistrictRequest";

export class CreateDistrictHandler {
  dataValidator: DataValidator;
  userRepository: UserRepository;
  districtRepository: DistrictRepository;
  serializer: ClassSerializer = new ClassSerializer();

  // dynamoDBClient should only be passed in for testing purposes
  constructor(dynamoDBClient?: DynamoDBClient) {
    this.dataValidator = new DataValidator();
    if (!dynamoDBClient) {
      this.userRepository = new UserRepository(
        new DynamoDBClient({
          region: "us-east-1",
        })
      );
      this.districtRepository = new DistrictRepository(
        new DynamoDBClient({
          region: "us-east-1",
        })
      );
    }
    else {
      this.userRepository = new UserRepository(dynamoDBClient);
      this.districtRepository = new DistrictRepository(dynamoDBClient);
    }
  }

  handleRequest: Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2> = async (event: APIGatewayProxyEventV2, context: Context, callback) => {
    let statusCode = 200;
    // Validate request object
    let request: CreateDistrictRequest;
    try {
      this.dataValidator.validate(event.body, "event.body").notUndefined().notNull();
      request = JSON.parse(event.body!);
      // Todo: validate the request object
    } catch (error) {
      if (error instanceof DataValidationError) {
        return {
          statusCode: 400,
          body: `Request has one or more missing or invalid attributes: ${error.message}`
        }
      }
    }

    console.log("Recieved createDistrictRequest: ", request!);

    // Todo: Confirm the user is not banned


    // Save the district to the database
    const district = District.builder({
      id: null,
      title: request!.title,
      authorUsername: request!.authorUsername,
      createDate: new Date(),
      subscriberCount: 0,
      viewCount: 0,
      postCount: 0,
      convoCount: 0,
      talkingPointCount: 0,
      banStatus: {
        type: ObjectBanType.NONE,
      },
      viewMode: request!.viewMode,
      primaryCategory: request!.primaryCategory,
      secondaryCategory: request!.secondaryCategory,
      tertiaryCategory: request!.tertiaryCategory,
      description: request!.description,
      thumbnail: request!.thumbnail
    })

    const dynamoResponse = await this.districtRepository.save(district);
    // Return the newly created district.

    return {
      statusCode: 200,
      body: this.serializer.serialize(district)
    }
  };

}

/**
 * If you call an instance method inside a handler you’re likely to get an error like the one above. 
 * It is a well known side effect of passing functions as value.
 * Because they are being used in isolation through dynamic binding, they lose the calling context.
 * Luckily, this can be easily solved with context binding:
 */
const createDistrictHandler = new CreateDistrictHandler();
export const createDistrictHandler_handleRequest = createDistrictHandler.handleRequest.bind(createDistrictHandler);