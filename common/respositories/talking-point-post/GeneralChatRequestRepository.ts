import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ConvoPreference, ParentType } from "../../objects/enums";
import { GeneralChatRequest } from "../../objects/talking-point-post/GeneralChatRequest";
import { DistrictRepository } from "../district/DistrictRepository";
import { DynamoDBKeyNames, GSIIndexNames } from "../DynamoDBConstants";
import { Repository } from "../Repository";
import { ParentObjectDoesNotExistError } from "../error";

export class GeneralChatRequestRepository extends Repository<GeneralChatRequest> {
  static objectIdentifier = "GENERAL_CHAT_REQ";
  #districtRepository: DistrictRepository;

  createPartitionKey(object: GeneralChatRequest): string {
    return object.id;
  }

  createSortKey(object: GeneralChatRequest): string {
    return [
      GeneralChatRequestRepository.objectIdentifier,
      object.convoPreference
    ].join(Repository.compositeKeyDelimeter);
  }

  constructor(client: DynamoDBClient) {
    super(client, GeneralChatRequest);
    this.#districtRepository = new DistrictRepository(client);
  }

  async save(chatRequest: GeneralChatRequest, checkForExistingParent: boolean) {
    GeneralChatRequest.validate(chatRequest);

    // This may change in the future.
    if (chatRequest.parentType !== ParentType.TALKING_POINT_POST) {
      throw new Error("General Chat Requests can only be parented under a talking point post")
    }

    if (checkForExistingParent) {
      const existingDistrict = await this.#districtRepository.getByTitle(chatRequest.parentId);
      if (existingDistrict == null) {
        throw new ParentObjectDoesNotExistError();
      }
    }

    const items: Record<string, AttributeValue> = {};
    items[`${DynamoDBKeyNames.GSI1_PARTITION_KEY}`] = { S: chatRequest.parentId };
    items[`${DynamoDBKeyNames.GSI1_SORT_KEY}`] = { S: this.createSortKey(chatRequest) };
    items[`${DynamoDBKeyNames.GSI2_PARTITION_KEY}`] = { S: chatRequest.authorUserName };
    items[`${DynamoDBKeyNames.GSI2_SORT_KEY}`] = { S: this.createSortKey(chatRequest) };

    return await super.saveItem({ object: chatRequest, checkForExistingKey: "PRIMARY" });
  }


  /**
   * Retrieve a single General Chat Request by its unique id.
   * @param chatRequestId 
   * @returns 
   */
  async getById(chatRequestId: string) {
    return await super.getUniqueItemByCompositeKey({
      primaryKey: chatRequestId,
      sortKey: GeneralChatRequestRepository.objectIdentifier,
      shouldPartialMatchSortKey: true,
    });
  }

  /**
   * Retrieve multiple General chat requests under a Talking point post
   * @param params 
   * @returns 
   */
  async getByTalkingPointPost(params: {
    postId: string,
    convoPreference?: ConvoPreference,
    paginationToken?: Record<string, AttributeValue>,
    queryLimit?: number;
  }) {
    let sortKey = GeneralChatRequestRepository.objectIdentifier;
    if (params.convoPreference) {
      sortKey = [
        GeneralChatRequestRepository.objectIdentifier,
        params.convoPreference
      ].join(Repository.compositeKeyDelimeter);
    }

    return await super.getItemsByCompositeKey({
      primaryKey: params.postId,
      sortKey: sortKey,
      shouldPartialMatchSortKey: true,
      indexName: GSIIndexNames.GSI1,
      paginationToken: params.paginationToken,
      queryLimit: params.queryLimit
    });
  }

  /**
   * Retrieve multiple General chat requests created by a specific user.
   * @param params 
   * @returns 
   */
  async getByAuthorUsername(params: {
    username: string,
    paginationToken?: Record<string, AttributeValue>,
    queryLimit?: number;
  }) {
    return await super.getItemsByCompositeKey({
      primaryKey: params.username,
      sortKey: GeneralChatRequestRepository.objectIdentifier,
      shouldPartialMatchSortKey: true,
      indexName: GSIIndexNames.GSI2,
      paginationToken: params.paginationToken,
      queryLimit: params.queryLimit
    });
  }

}