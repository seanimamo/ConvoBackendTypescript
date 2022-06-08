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
    ].join('_');
  }

  constructor(client: DynamoDBClient) {
    super(client, GeneralChatRequest);
    this.#districtRepository = new DistrictRepository(client);
  }

  async save(chatRequest: GeneralChatRequest, checkForExistingParent: boolean) {
    GeneralChatRequest.validate(chatRequest);

    if (chatRequest.parentType !== ParentType.DISTRICT) {
      throw new Error("General Chat Requests can only be parented under a district")
    }

    if (checkForExistingParent) {
      const existingDistrict = await this.#districtRepository.getByTitle(chatRequest.parentId);
      if (existingDistrict == null) {
        throw new ParentObjectDoesNotExistError();
      }
    }

    const items: Record<string, AttributeValue> = {}
    items[`${DynamoDBKeyNames.GSI1_PARTITION_KEY}`] = { S: chatRequest.parentId };
    items[`${DynamoDBKeyNames.GSI1_SORT_KEY}`] = { S: GeneralChatRequestRepository.objectIdentifier };
    items[`${DynamoDBKeyNames.GSI2_PARTITION_KEY}`] = { S: chatRequest.authorUserName };
    items[`${DynamoDBKeyNames.GSI2_SORT_KEY}`] = { S: GeneralChatRequestRepository.objectIdentifier };

    return await super.saveItem({ object: chatRequest, checkForExistingKey: "PRIMARY" });
  }

  async getByTalkingPointPost(postId: string, convoPreference?: ConvoPreference) {
    let sortKey = GeneralChatRequestRepository.objectIdentifier;
    if (convoPreference) {
      sortKey = [
        GeneralChatRequestRepository.objectIdentifier,
        convoPreference
      ].join('_');
    }

        // THIS WONT WORK BECAUSE MULTIPLE CHAT REQUESTS ARE PARENTED UNDER A TALKING POINT
    return await super.getUniqueItemByCompositeKey({
      primaryKey: postId,
      sortKey: sortKey,
      shouldPartialMatchSortKey: true,
      indexName: GSIIndexNames.GSI1
    });
  }

  async getByAuthorUsername(username: string) {
    return await super.getUniqueItemByCompositeKey({
      primaryKey: username,
      sortKey: GeneralChatRequestRepository.objectIdentifier,
      shouldPartialMatchSortKey: true,
      indexName: GSIIndexNames.GSI2
    });
  }

}