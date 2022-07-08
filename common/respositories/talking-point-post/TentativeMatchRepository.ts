// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { GeneralChatRequest } from "../../objects/talking-point-post/GeneralChatRequest";
// import { Repository } from "../Repository";
// import { TalkingPointPostRepository } from "./TalkingPointPostRepository";
// import { TentativeMatch } from "../../objects/talking-point-post/TentativeMatch";

export class TentativeMatchRepository  {

}
// export class TentativeMatchRepository extends Repository<TentativeMatch<GeneralChatRequest>> {
  // static objectIdentifier = "Tentative_Match";
  // #talkingPointPostRepo: TalkingPointPostRepository;

  // createPartitionKey(object: TentativeMatch<GeneralChatRequest>): string {
  //   return object.id;
  // }

  // createSortKey(object: TentativeMatch<GeneralChatRequest>): string {
  //   return [
  //     TentativeMatchRepository.objectIdentifier
  //   ].join(Repository.compositeKeyDelimeter);
  // }

  // constructor(client: DynamoDBClient) {
  //   super(client, TentativeMatch);
  //   this.#talkingPointPostRepo = new TalkingPointPostRepository(client);
  // }

  // async save(params: { data: TentativeMatch<GeneralChatRequest>, checkParentExistence?: boolean }) {
  //   // TentativeMatch.validate(params.data);

  //   // const items: Record<string, AttributeValue> = {};
  //   // items[`${DynamoDBKeyNames.GSI1_PARTITION_KEY}`] = { S: params.data.authorUserName };
  //   // items[`${DynamoDBKeyNames.GSI1_SORT_KEY}`] = { S: this.createSortKey(params.data) };
  //   // items[`${DynamoDBKeyNames.GSI2_PARTITION_KEY}`] = { S: params.data.authorUserName };
  //   // items[`${DynamoDBKeyNames.GSI2_SORT_KEY}`] = { S: this.createSortKey(params.data) };

  //   return await super.saveItem({ object: params.data, checkForExistingKey: "PRIMARY" });
  // }


  // /**
  //  * Retrieve a single General Chat Request by its unique id.
  //  * @param chatRequestId 
  //  * @returns 
  //  */
  // async getById(chatRequestId: string) {
  //   return await super.getUniqueItemByCompositeKey({
  //     primaryKey: chatRequestId,
  //     sortKey: TentativeMatchRepository.objectIdentifier,
  //     shouldPartialMatchSortKey: true,
  //   });
  // }

  // TODO: Since a tentative match could have an unbounded number of users we cannot dedicate a single GSI.
  // So, tags/pointers will be needed to retrieve the them by author username

  // async getByAuthorUsername(params: {
  //   username: string,
  //   paginationToken?: Record<string, AttributeValue>,
  //   queryLimit?: number;
  // }) {
  //   return await super.getItemsByCompositeKey({
  //     primaryKey: params.username,
  //     sortKey: GeneralChatRequestRepository.objectIdentifier,
  //     shouldPartialMatchSortKey: true,
  //     indexName: GSIIndexNames.GSI2,
  //     paginationToken: params.paginationToken,
  //     queryLimit: params.queryLimit
  //   });
  // }

// }