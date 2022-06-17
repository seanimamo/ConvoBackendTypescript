import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ParentType } from "../../objects/enums";
import { DistrictRepository } from "../district/DistrictRepository";
import { DynamoDBKeyNames, GSIIndexNames } from "../DynamoDBConstants";
import { Repository } from "../Repository";
import { ParentObjectDoesNotExistError } from "../error";
import { TalkingPointPost } from "../../objects/talking-point-post/TalkingPointPost";


/**
 * (Get post by id)
 * PKEY: id
 * SKEY: POST_TALKING_POINT
 * 
 * 
 * 
 * (Get all posts, sorted by absolute score)
 * GSI1: POST_TALKING_POINT
 * SKEY: <absoluteScore>
 * 
 * (Get all posts, sorted by time based score)
 * GSI2: POST_TALKING_POINT
 * SKEY: <timeBasedScore>
 * 
 * 
 * (Note there are multiple gsi's here to account for participants in a convo.)
 * (Get posts by author username, sorted by create date)
 * GSI3: authorUserName
 * SKEY: POST_TALKING_POINT-<createDate>
 * 
 * (Get posts by author username, sorted by create date)
 * GSI4: authorUserName 2
 * SKEY: POST_TALKING_POINT-<createDate>
 * 
 * (Get posts by author username, sorted by create date)
 * GSI5: authorUserName 3
 * SKEY: POST_TALKING_POINT-<createDate>
 * 
 * (Get posts by author username, sorted by create date)
 * GSI6: authorUserName 4
 * SKEY: POST_TALKING_POINT-<createDate>
 * 
 * 
 * 
 * (Get posts by district, sorted by absolute score) 
 * GSI7: parentId
 * SKEY: POST_TALKING_POINT-<absoluteScore>
 * 
 * (Get posts by district, sorted by time based score)
 * GSI8: parentId
 * SKEY: POST_TALKING_POINT-<timeBasedScore>
 * 
 * (Get posts by district, sorted by Positive Trait timed based scoring -
 * Funny, Knowledgeable, Upbeat, High Quality, Impactful):
 * GSI9 to GSI13 : parentId
 * SKEY: POST_TALKING_POINT-<Trait Name>-<TraitTimeBasedScore>
 * 
 * (Get posts by district, sorted by Negative Trait timed based scoring - Offensive, Disturbing):
 * GSI13 to GSI15: parentId
 * SKEY: POST_TALKING_POINT-<Trait Name>-<TraitTimeBasedScore>
 * 
 */
export class TalkingPointPostRepository extends Repository<TalkingPointPost> {
  static objectIdentifier = "POST_TALKING_POINT";
  #districtRepository: DistrictRepository;

  createPartitionKey(object: TalkingPointPost): string {
    return object.id;
  }

  createSortKey(object: TalkingPointPost): string {
    return [TalkingPointPostRepository.objectIdentifier,
    `${object.banStatus.type}`, object.viewMode, object.metrics.absoluteScore
    ].join(Repository.compositeKeyDelimeter);
  }

  constructor(client: DynamoDBClient) {
    super(client, TalkingPointPost);
    this.#districtRepository = new DistrictRepository(client);
  }

  async save(params: { data: TalkingPointPost, checkParentExistence?: boolean }) {
    TalkingPointPost.validate(params.data);
    if (params.checkParentExistence === undefined) {
      params.checkParentExistence = true;
    }

    if (params.data.parentType !== ParentType.DISTRICT) {
      throw new Error("General Chat Requests can only be parented under a district")
    }

    if (params.checkParentExistence) {
      const existingDistrict = await this.#districtRepository.getByTitle(params.data.parentId);
      if (existingDistrict == null) {
        throw new ParentObjectDoesNotExistError();
      }
    }

    const gsiAttributes: Record<string, AttributeValue> = {}
    gsiAttributes[`${DynamoDBKeyNames.GSI1_PARTITION_KEY}`] = { S: params.data.parentId };
    gsiAttributes[`${DynamoDBKeyNames.GSI1_SORT_KEY}`] = { S: this.createSortKey(params.data) };
    gsiAttributes[`${DynamoDBKeyNames.GSI2_PARTITION_KEY}`] = { S: params.data.authorUserName };
    gsiAttributes[`${DynamoDBKeyNames.GSI2_SORT_KEY}`] = { S: this.createSortKey(params.data) };

    return await super.saveItem({
      object: params.data,
      checkForExistingKey: "PRIMARY",
      extraItemAttributes: gsiAttributes
    });
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
    paginationToken?: Record<string, AttributeValue>,
    queryLimit?: number;
  }) {
    return await super.getItemsByCompositeKey({
      primaryKey: params.title,
      sortKey: TalkingPointPostRepository.objectIdentifier,
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