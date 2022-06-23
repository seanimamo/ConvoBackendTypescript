import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ParentType, ViewMode } from "../../objects/enums";
import { DistrictRepository } from "../district/DistrictRepository";
import { DYNAMODB_INDEXES } from "../DynamoDBConstants";
import { Repository } from "../Repository";
import { ParentObjectDoesNotExistError } from "../error";
import { TalkingPointPost } from "../../objects/talking-point-post/TalkingPointPost";
import { ObjectBanType } from "../../objects/ObjectBanStatus";


/**
 * (Get post by id)
 * PKEY: id
 * SKEY: <viewMode>#<banStatus>#POST_TALKING_POINT
 * 
 * (Get post by title)
 * GSI1: title
 * SKEY: <viewMode>#<banStatus>#POST_TALKING_POINT
 * 
 * 
 * (Get all posts, sorted by absolute score)
 * GSI2: <viewMode>#<banStatus>#POST_TALKING_POINT
 * SKEY: <absoluteScore>
 * 
 * (Get all posts, sorted by time based score)
 * GSI3: <viewMode>#<banStatus>#POST_TALKING_POINT
 * SKEY: <timeBasedScore>
 * 
 *  
 * 
 * (Get post by reply to / parent post id
 * GSI4: parent post id
 * SKEY: <viewMode>#<banStatus>#POST_TALKING_POINT#<absoluteScore>
 * 
 * 
 * 
 * (Note there are multiple gsi's here to account for participants in a convo.)
 * (Get posts by author username, sorted by create date)
 * GSI5: authorUserName
 * SKEY: POST_TALKING_POINT#<createDate>
 * 
 * (Get posts by author username, sorted by create date)
 * GSI6: authorUserName 2
 * SKEY: <viewMode>#<banStatus>#POST_TALKING_POINT#<createDate>
 * 
 * (Get posts by author username, sorted by create date)
 * GSI7: authorUserName 3
 * SKEY: <viewMode>#<banStatus>#POST_TALKING_POINT#<createDate>
 * 
 * (Get posts by author username, sorted by create date)
 * GSI8: authorUserName 4
 * SKEY: <viewMode>#<banStatus>#POST_TALKING_POINT#<createDate>
 * 
 * 
 * 
 * (Get posts by district, sorted by absolute score) 
 * GSI9: parentId
 * SKEY: <viewMode>#<banStatus>#POST_TALKING_POINT#<absoluteScore>
 * 
 * (Get posts by district, sorted by time based score)
 * GSI10: parentId
 * SKEY: <viewMode>#<banStatus>#POST_TALKING_POINT#<timeBasedScore>
 * 
 * (Get posts by district, sorted by Positive Trait timed based scoring -
 * Funny, Knowledgeable, Upbeat, High Quality, Impactful):
 * GSI11 to GSI15 : parentId
 * SKEY: <viewMode>#<banStatus>#POST_TALKING_POINT#<Trait Name>#<TraitTimeBasedScore>
 * 
 * (Get posts by district, sorted by Negative Trait timed based scoring - Offensive, Disturbing):
 * GSI15 to GSI17: parentId
 * SKEY: <viewMode>#<banStatus>#POST_TALKING_POINT#<Trait Name>#<TraitTimeBasedScore>
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
    object.viewMode, object.banStatus.type, object.metrics.absoluteScore,
    ].join(Repository.compositeKeyDelimeter);
  }

  // GSi key for replys should include the source type

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
    gsiAttributes[`${DYNAMODB_INDEXES.GSI1.partitionKeyName}`] = { S: params.data.parentId };
    gsiAttributes[`${DYNAMODB_INDEXES.GSI1.sortKeyName}`] = { S: this.createSortKey(params.data) };
    gsiAttributes[`${DYNAMODB_INDEXES.GSI2.partitionKeyName}`] = { S: params.data.authorUserName };
    gsiAttributes[`${DYNAMODB_INDEXES.GSI2.sortKeyName}`] = { S: this.createSortKey(params.data) };

    return await super.saveItem({
      object: params.data,
      checkForExistingKey: "PRIMARY",
      extraItemAttributes: gsiAttributes
    });
  }


  // Retrieve a single Talking Point Post by its unique id.
  async getById(chatRequestId: string, banType?: ObjectBanType, viewMode?: ViewMode) {
    let sortKey = TalkingPointPostRepository.objectIdentifier;
    if (viewMode) {
      sortKey = [sortKey, viewMode].join(TalkingPointPostRepository.objectIdentifier);
    }
    if (banType) {
      sortKey = [sortKey, banType].join(TalkingPointPostRepository.objectIdentifier);
    }

    return await super.getUniqueItemByCompositeKey({
      primaryKey: chatRequestId,
      sortKey: sortKey,
      shouldPartialMatchSortKey: true,
    });
  }

  // Retrieve multiple Talking Point Posts under a District
  async getByDistrictTitle(params: {
    title: string,
    banType?: ObjectBanType,
    viewMode?: ViewMode,
    paginationToken?: Record<string, AttributeValue>,
    queryLimit?: number;
  }) {

    let sortKey = TalkingPointPostRepository.objectIdentifier;
    if (params.viewMode) {
      sortKey = [sortKey, params.viewMode].join(TalkingPointPostRepository.objectIdentifier);
    }
    if (params.banType) {
      sortKey = [sortKey, params.banType].join(TalkingPointPostRepository.objectIdentifier);
    }

    return await super.getItemsByCompositeKey({
      primaryKey: params.title,
      sortKey: sortKey,
      shouldPartialMatchSortKey: true,
      index: DYNAMODB_INDEXES.GSI1,
      paginationToken: params.paginationToken,
      queryLimit: params.queryLimit
    });
  }

  // Retrieve multiple Talking Point Posts created by a specific user.
  async getByAuthorUsername(params: {
    username: string,
    banType?: ObjectBanType,
    viewMode?: ViewMode,
    paginationToken?: Record<string, AttributeValue>,
    queryLimit?: number;
  }) {

    let sortKey = TalkingPointPostRepository.objectIdentifier;
    if (params.viewMode) {
      sortKey = [sortKey, params.viewMode].join(TalkingPointPostRepository.objectIdentifier);
    }
    if (params.banType) {
      sortKey = [sortKey, params.banType].join(TalkingPointPostRepository.objectIdentifier);
    }

    return await super.getItemsByCompositeKey({
      primaryKey: params.username,
      sortKey: sortKey,
      shouldPartialMatchSortKey: true,
      index: DYNAMODB_INDEXES.GSI2,
      paginationToken: params.paginationToken,
      queryLimit: params.queryLimit
    });
  }

}