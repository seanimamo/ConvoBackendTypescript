import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ConvoPreference } from "../../objects/enums";
import { Repository } from "../Repository";
import { ParentObjectDoesNotExistError } from "../error";
import { DYNAMODB_INDEXES } from "../DynamoDBConstants";
import { ObjectId } from "../../objects/ObjectId";
import { TalkingPointPostId } from "../../objects/talking-point-post/TalkingPointPost";
import { TalkingPointPostRepository } from "../talking-point-post/TalkingPointPostRepository";
import { Upvote, UpvoteId } from "../../objects/vote/Upvote";

class UpvoteRepositoryGsiSortKey extends ObjectId {
  public getIdentifier(): string {
      return UpvoteId.IDENTIFIER;
  }
}

export class UpvoteRepository extends Repository<Upvote> {
  #talkingPointPostRepo: TalkingPointPostRepository;

  createPartitionKey(object: Upvote): string {
    return object.id.getValue(); 
  }

  createSortKey(object: Upvote): string {
    return object.id.getValue();
  }

  constructor(client: DynamoDBClient) {
    super(client, Upvote);
    this.#talkingPointPostRepo = new TalkingPointPostRepository(client);
  }

  async save(params: { data: Upvote, checkParentExistence?: boolean }) {
    Upvote.validate(params.data);
    if (params.checkParentExistence === undefined) {
      params.checkParentExistence = true;
    }

    // This may change in the future.
    if (params.data.parentId.getIdentifier() !== TalkingPointPostId.IDENTIFIER) {
      throw new Error("Upvotes can only be parented under a talking point post")
    }

    if (params.checkParentExistence) {
      const existingTalkingPoint = await this.#talkingPointPostRepo.getById(params.data.parentId);
      if (existingTalkingPoint == null) {
        throw new ParentObjectDoesNotExistError();
      }
    }

    const items: Record<string, AttributeValue> = {};
    const createDateGsiSortKey = new UpvoteRepositoryGsiSortKey([params.data.createDate]);

    // Get by parent id, sorted by createDate
    items[`${DYNAMODB_INDEXES.GSI1.partitionKeyName}`] = { S: params.data.parentId.getValue() };
    items[`${DYNAMODB_INDEXES.GSI1.sortKeyName}`] = { S: createDateGsiSortKey.getValue() };

    // Get by authorUserName, sorted by createDate
    items[`${DYNAMODB_INDEXES.GSI2.partitionKeyName}`] = { S: params.data.authorUserName };
    items[`${DYNAMODB_INDEXES.GSI2.sortKeyName}`] = { S: createDateGsiSortKey.getValue() };

    return await super.saveItem({ object: params.data, checkForExistingKey: "PRIMARY", extraItemAttributes: items });
  }

  /**
   * Retrieve a single upvotes by its unique id.
   * @param chatRequestId 
   * @returns 
   */
  async getById(id: UpvoteId) {
    return await super.getUniqueItemByCompositeKey({
      primaryKey: id.getValue(),
      sortKey: {
        value: UpvoteId.IDENTIFIER,
        conditionExpressionType: "BEGINS_WITH",
      },
    });
  }

  /**
   * Retrieve multiple upvotes under a Talking point post
   * @param params 
   * @returns 
   */
  async getByTalkingPointPost(params: {
    postId: TalkingPointPostId,
    convoPreference?: ConvoPreference,
    paginationToken?: Record<string, AttributeValue>,
    queryLimit?: number;
  }) {
    let sortKeyValue = UpvoteId.IDENTIFIER;
    if (params.convoPreference) {
      sortKeyValue = [
        UpvoteId.IDENTIFIER,
        params.convoPreference
      ].join(Repository.compositeKeyDelimeter);
    }

    return await super.getItemsByCompositeKey({
      primaryKey: params.postId.getValue(),
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

  /**
   * Retrieve multiple upvotes created by a specific user.
   */
  async getByAuthorUsername(params: {
    username: string,
    paginationToken?: Record<string, AttributeValue>,
    queryLimit?: number;
  }) {
    return await super.getItemsByCompositeKey({
      primaryKey: params.username,
      sortKey: {
        value: UpvoteId.IDENTIFIER,
        conditionExpressionType: "BEGINS_WITH"
      },
      index: DYNAMODB_INDEXES.GSI2,
      paginationToken: params.paginationToken,
      queryLimit: params.queryLimit,
      sortDirection: "DESCENDING"
    });
  }

}