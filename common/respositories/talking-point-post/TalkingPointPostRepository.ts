import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ParentType, ViewMode } from "../../objects/enums";
import { DistrictRepository } from "../district/DistrictRepository";
import { DYNAMODB_INDEXES } from "../DynamoDBConstants";
import { Repository } from "../Repository";
import { ParentObjectDoesNotExistError } from "../error";
import { TalkingPointPost, TalkingPointPostId } from "../../objects/talking-point-post/TalkingPointPost";
import { ObjectBanType } from "../../objects/ObjectBanStatus";
import { ObjectId } from "../../objects/ObjectId";
import { DistrictId } from "../../objects/District";


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
 * (Get post by reply to / reply post id
 * GSI4: reply post id
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
  #districtRepository: DistrictRepository;

  createPartitionKey(object: TalkingPointPost): string {
    return object.id.getValue();
  }

  createSortKey(object: TalkingPointPost): string {
    return [TalkingPointPostId.IDENTIFIER,
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

    if (ObjectId.getIdentifier(params.data.parentId) !== DistrictId.IDENTIFIER) {
      throw new Error("General Chat Requests can only be parented under a district")
    }

    if (params.checkParentExistence) {
      // TODO: add logic to get the title from a DistrictId without having to manually parse
      const existingDistrict = await this.#districtRepository.getByTitle(ObjectId.parseId(params.data.parentId)[1]);
      if (existingDistrict == null) {
        throw new ParentObjectDoesNotExistError();
      }
    }

    const gsiAttributes: Record<string, AttributeValue> = {}
    gsiAttributes[`${DYNAMODB_INDEXES.GSI1.partitionKeyName}`] = { S: params.data.parentId.getValue() };
    gsiAttributes[`${DYNAMODB_INDEXES.GSI1.sortKeyName}`] = { S: this.createSortKey(params.data) };
    gsiAttributes[`${DYNAMODB_INDEXES.GSI2.partitionKeyName}`] = { S: params.data.authorUserName };
    gsiAttributes[`${DYNAMODB_INDEXES.GSI2.sortKeyName}`] = { S: this.createSortKey(params.data) };

    // * (Get post by id)
    // * PKEY: id
    // * SKEY: <viewMode>#<banStatus>#POST_TALKING_POINT
    // * 
    // * (Get post by title)
    // * GSI1: title
    // * SKEY: <viewMode>#<banStatus>#POST_TALKING_POINT
    // * 
    // * 
    // * (Get all posts, sorted by absolute score)
    // * GSI2: <viewMode>#<banStatus>#POST_TALKING_POINT
    // * SKEY: <absoluteScore>
    // * 
    // * (Get all posts, sorted by time based score)
    // * GSI3: <viewMode>#<banStatus>#POST_TALKING_POINT
    // * SKEY: <timeBasedScore>

    return await super.saveItem({
      object: params.data,
      checkForExistingKey: "PRIMARY",
      extraItemAttributes: gsiAttributes
    });
  }


  // Retrieve a single Talking Point Post by its unique id.
  async getById(id: TalkingPointPostId) {
    return await super.getUniqueItemByCompositeKey({
      primaryKey: id.getValue(),
      sortKey: {
        value: TalkingPointPostId.IDENTIFIER,
        conditionExpressionType: "BEGINS_WITH",
      },
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

    let sortKeyValue = TalkingPointPostId.IDENTIFIER;
    if (params.viewMode) {
      sortKeyValue = [sortKeyValue, params.viewMode].join(TalkingPointPostId.IDENTIFIER);
    }
    if (params.banType) {
      sortKeyValue = [sortKeyValue, params.banType].join(TalkingPointPostId.IDENTIFIER);
    }

    return await super.getItemsByCompositeKey({
      primaryKey: new DistrictId({title:params.title}).getValue(),
      sortKey: {
        value: sortKeyValue,
        conditionExpressionType: "BEGINS_WITH"
      },
      index: DYNAMODB_INDEXES.GSI1,
      paginationToken: params.paginationToken,
      queryLimit: params.queryLimit,
      sortDirection: "DESCENDING"
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

    let sortKeyValue = TalkingPointPostId.IDENTIFIER;
    if (params.viewMode) {
      sortKeyValue = [sortKeyValue, params.viewMode].join(TalkingPointPostId.IDENTIFIER);
    }
    if (params.banType) {
      sortKeyValue = [sortKeyValue, params.banType].join(TalkingPointPostId.IDENTIFIER);
    }

    return await super.getItemsByCompositeKey({
      primaryKey: params.username,
      sortKey: {
        value: sortKeyValue,
        conditionExpressionType: "BEGINS_WITH"
      },
      index: DYNAMODB_INDEXES.GSI2,
      paginationToken: params.paginationToken,
      queryLimit: params.queryLimit
    });
  }

}