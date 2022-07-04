import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ConvoPreference, ParentType } from "../../objects/enums";
import { GeneralChatRequest } from "../../objects/talking-point-post/GeneralChatRequest";
import { Repository } from "../Repository";
import { ParentObjectDoesNotExistError } from "../error";
import { TalkingPointPostRepository } from "./TalkingPointPostRepository";
import { DYNAMODB_INDEXES } from "../DynamoDBConstants";

export class GeneralChatRequestRepository extends Repository<GeneralChatRequest> {
  static objectIdentifier = "CHAT_REQ_GENERAL";
  #talkingPointPostRepo: TalkingPointPostRepository;

  // Note that create date is used in the id. 
  // In reality, since ISO date time is used a collision would only happen if another request was created with the same timestamp down to the millisecond.
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
    this.#talkingPointPostRepo = new TalkingPointPostRepository(client);
  }

  async save(params: { data: GeneralChatRequest, checkParentExistence?: boolean }) {
    GeneralChatRequest.validate(params.data);
    if (params.checkParentExistence === undefined) {
      params.checkParentExistence = true;
    }

    // This may change in the future.
    if (params.data.parentType !== ParentType.TALKING_POINT_POST) {
      throw new Error("General Chat Requests can only be parented under a talking point post")
    }

    if (params.checkParentExistence) {
      const existingTalkingPoint = await this.#talkingPointPostRepo.getById(params.data.parentId);
      if (existingTalkingPoint == null) {
        throw new ParentObjectDoesNotExistError();
      }
    }

    const items: Record<string, AttributeValue> = {};
    items[`${DYNAMODB_INDEXES.GSI1.partitionKeyName}`] = { S: params.data.parentId };
    items[`${DYNAMODB_INDEXES.GSI1.sortKeyName}`] = { S: this.createSortKey(params.data) };
    items[`${DYNAMODB_INDEXES.GSI2.partitionKeyName}`] = { S: params.data.authorUserName };
    items[`${DYNAMODB_INDEXES.GSI2.sortKeyName}`] = { S: this.createSortKey(params.data) };

    return await super.saveItem({ object: params.data, checkForExistingKey: "PRIMARY", extraItemAttributes: items });
  }


  /**
   * Retrieve a single General Chat Request by its unique id.
   * @param chatRequestId 
   * @returns 
   */
  async getById(chatRequestId: string) {
    return await super.getUniqueItemByCompositeKey({
      primaryKey: chatRequestId,
      sortKey: {
        value: GeneralChatRequestRepository.objectIdentifier,
        conditionExpressionType: "BEGINS_WITH",
      },
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
    let sortKeyValue = GeneralChatRequestRepository.objectIdentifier;
    if (params.convoPreference) {
      sortKeyValue = [
        GeneralChatRequestRepository.objectIdentifier,
        params.convoPreference
      ].join(Repository.compositeKeyDelimeter);
    }

    return await super.getItemsByCompositeKey({
      primaryKey: params.postId,
      sortKey: {
        value: sortKeyValue,
        conditionExpressionType: "BEGINS_WITH"
      },
      index: DYNAMODB_INDEXES.GSI1,
      paginationToken: params.paginationToken,
      queryLimit: params.queryLimit
    });
  }

  /**
   * Retrieve multiple General chat requests created by a specific user.
   */
  async getByAuthorUsername(params: {
    username: string,
    paginationToken?: Record<string, AttributeValue>,
    queryLimit?: number;
  }) {
    return await super.getItemsByCompositeKey({
      primaryKey: params.username,
      sortKey: {
        value: GeneralChatRequestRepository.objectIdentifier,
        conditionExpressionType: "BEGINS_WITH"
      },
      index: DYNAMODB_INDEXES.GSI2,
      paginationToken: params.paginationToken,
      queryLimit: params.queryLimit
    });
  }

}