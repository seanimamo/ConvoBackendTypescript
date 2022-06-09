import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ConvoPreference, ParentType } from "../../objects/enums";
import { DistrictRepository } from "../district/DistrictRepository";
import { DynamoDBKeyNames, GSIIndexNames } from "../DynamoDBConstants";
import { Repository } from "../Repository";
import { ParentObjectDoesNotExistError } from "../error";
import { TalkingPointPost } from "../../objects/talking-point-post/TalkingPointPost";

export class TalkingPointPostRepository extends Repository<TalkingPointPost> {
  static objectIdentifier = "TALKING_POINT_POST";
  #districtRepository: DistrictRepository;

  createPartitionKey(object: TalkingPointPost): string {
    return object.id;
  }

  createSortKey(object: TalkingPointPost): string {
    return [
      TalkingPointPostRepository.objectIdentifier,
      object.absoluteScore
    ].join('_');
  }

  constructor(client: DynamoDBClient) {
    super(client, TalkingPointPost);
    this.#districtRepository = new DistrictRepository(client);
  }

  async save(post: TalkingPointPost, checkForExistingParent: boolean) {
    TalkingPointPost.validate(post);

    if (post.parentType !== ParentType.DISTRICT) {
      throw new Error("General Chat Requests can only be parented under a district")
    }

    if (checkForExistingParent) {
      const existingDistrict = await this.#districtRepository.getByTitle(post.parentId);
      if (existingDistrict == null) {
        throw new ParentObjectDoesNotExistError();
      }
    }

    const items: Record<string, AttributeValue> = {}
    items[`${DynamoDBKeyNames.GSI1_PARTITION_KEY}`] = { S: post.parentId };
    items[`${DynamoDBKeyNames.GSI1_SORT_KEY}`] = { S: TalkingPointPostRepository.objectIdentifier };
    items[`${DynamoDBKeyNames.GSI2_PARTITION_KEY}`] = { S: post.authorUserName };
    items[`${DynamoDBKeyNames.GSI2_SORT_KEY}`] = { S: TalkingPointPostRepository.objectIdentifier };

    return await super.saveItem({ object: post, checkForExistingKey: "PRIMARY" });
  }


  // Retrieve a single Talking Point Post by its unique id.
  async getById(chatRequestId: string) {
    return await super.getUniqueItemByCompositeKey({
      primaryKey: chatRequestId,
      sortKey: TalkingPointPostRepository.objectIdentifier,
      shouldPartialMatchSortKey: true,
    });
  }

  // Retrieve multiple Talking Point Posts under a District
  async getByDistrictTitle(params: {
    title: string,
    convoPreference?: ConvoPreference,
    paginationToken?: Record<string, AttributeValue>,
    queryLimit?: number;
  }) {
    let sortKey = TalkingPointPostRepository.objectIdentifier;
    if (params.convoPreference) {
      sortKey = [
        TalkingPointPostRepository.objectIdentifier,
        params.convoPreference
      ].join('_');
    }

    return await super.getItemsByCompositeKey({
      primaryKey: params.title,
      sortKey: sortKey,
      shouldPartialMatchSortKey: true,
      indexName: GSIIndexNames.GSI1,
      paginationToken: params.paginationToken,
      queryLimit: params.queryLimit
    });
  }

  // Retrieve multiple Talking Point Posts created by a specific user.
  async getByAuthorUsername(params: {
    username: string,
    paginationToken?: Record<string, AttributeValue>,
    queryLimit?: number;
  }) {
    return await super.getItemsByCompositeKey({
      primaryKey: params.username,
      sortKey: TalkingPointPostRepository.objectIdentifier,
      shouldPartialMatchSortKey: true,
      indexName: GSIIndexNames.GSI2,
      paginationToken: params.paginationToken,
      queryLimit: params.queryLimit
    });
  }

}