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


  async getById(chatRequestId: string) {
    return await super.getUniqueItemByCompositeKey({
      primaryKey: chatRequestId,
      sortKey: TalkingPointPostRepository.objectIdentifier,
      shouldPartialMatchSortKey: true,
    });
  }

  // TODO: THIS WONT WORK BECAUSE MULTIPLE TALKINGPOINTS ARE PARENTED UNDER A DISTRICT
  // This should return multiple
  // TODO: Implement Pagination
  async getByDistrictTitle(title: string, convoPreference?: ConvoPreference) {
    // let sortKey = TalkingPointPostRepository.objectIdentifier;
    // if (convoPreference) {
    //   sortKey = [
    //     TalkingPointPostRepository.objectIdentifier,
    //     convoPreference
    //   ].join('_');
    // }

    // return await super.getUniqueItemByCompositeKey({
    //   primaryKey: title,
    //   sortKey: sortKey,
    //   shouldPartialMatchSortKey: true,
    //   indexName: GSIIndexNames.GSI1
    // });
  }

  // TODO: This should return multiple
  // TODO: Implement Pagination
  async getByAuthorUsername(username: string) {
    // return await super.getUniqueItemByCompositeKey({
    //   primaryKey: username,
    //   sortKey: TalkingPointPostRepository.objectIdentifier,
    //   shouldPartialMatchSortKey: true,
    //   indexName: GSIIndexNames.GSI2
    // });
  }

}