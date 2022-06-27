
import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Convo } from "../../objects/Convo";
import { DYNAMODB_INDEXES } from "../DynamoDBConstants";
import { Repository } from "../Repository";

/**
 * (Get Convo by id)
 * PKEY: id
 * SKEY: CONVO
 * 
 * 
 * 
* (Note there are multiple gsi's here to account for participants in a convo.)
 * (Get posts by author username, sorted by create date)
 * GSI1: authorUserName
 * SKEY: CONVO#<createDate>
 * 
 * (Get posts by author username, sorted by create date)
 * GSI2: authorUserName 2
 * SKEY: CONVO#<createDate>
 * 
 * (Get posts by author username, sorted by create date)
 * GSI3: authorUserName 3
 * SKEY: CONVO#<createDate>
 * 
 * (Get posts by author username, sorted by create date)
 * GSI4: authorUserName 4
 * SKEY: CONVO#<createDate>
 * 
 */
export class ConvoRepository extends Repository<Convo> {
  static objectIdentifier = "CONVO";

  createPartitionKey(object: Convo): string {
    return object.id;
  }

  createSortKey(object: Convo): string {
    return [ConvoRepository.objectIdentifier,
    object.createDate.toISOString(),
    ].join(Repository.compositeKeyDelimeter);
  }

  constructor(client: DynamoDBClient) {
    super(client, Convo);
  }

  async save(convo: Convo) {
    Convo.validate(convo);

    const gsiAttributes: Record<string, AttributeValue> = {}
    gsiAttributes[`${DYNAMODB_INDEXES.GSI1.partitionKeyName}`] = { S: this.createPartitionKey(convo) };
    gsiAttributes[`${DYNAMODB_INDEXES.GSI1.sortKeyName}`] = { S: this.createSortKey(convo) };
    gsiAttributes[`${DYNAMODB_INDEXES.GSI2.partitionKeyName}`] = { S: convo.participantUsernames[0] };
    gsiAttributes[`${DYNAMODB_INDEXES.GSI2.sortKeyName}`] = { S: this.createSortKey(convo) };
    if (convo.participantUsernames.length > 1) {
      gsiAttributes[`${DYNAMODB_INDEXES.GSI3.partitionKeyName}`] = { S: convo.participantUsernames[1] };
      gsiAttributes[`${DYNAMODB_INDEXES.GSI3.sortKeyName}`] = { S: this.createSortKey(convo) };
    }
    if (convo.participantUsernames.length > 2) {
      gsiAttributes[`${DYNAMODB_INDEXES.GSI4.partitionKeyName}`] = { S: convo.participantUsernames[2] };
      gsiAttributes[`${DYNAMODB_INDEXES.GSI4.sortKeyName}`] = { S: this.createSortKey(convo) };
    }
    if (convo.participantUsernames.length > 3) {
      gsiAttributes[`${DYNAMODB_INDEXES.GSI5.partitionKeyName}`] = { S: convo.participantUsernames[3] };
      gsiAttributes[`${DYNAMODB_INDEXES.GSI5.sortKeyName}`] = { S: this.createSortKey(convo) };
    }

    return await super.saveItem({
      object: convo,
      checkForExistingKey: "PRIMARY",
      extraItemAttributes: gsiAttributes
    });
  }

  /**
   * Retrieve a single Talking Point Post by its unique id.
   */
  async getById(id: string) {
    return await super.getUniqueItemByCompositeKey({
      primaryKey: id,
      sortKey: ConvoRepository.objectIdentifier,
      shouldPartialMatchSortKey: true,
    });
  }

  /**
   * Retrieve a single Talking Point Post by author username. This method may take up to 4 queries  
   * to succeed since a convo may have up to 4 authors and each author name maybe be on 1 of 4 gsi's.
   * If the item is found, the index will be returned on the query hint portion of the paginated response.
   */
  async getByAuthorUsername(params: {
    username: string,
    paginationToken?: Record<string, AttributeValue>,
    queryLimit?: number;
  }) {
    const sortKey = ConvoRepository.objectIdentifier;
    
    let index = DYNAMODB_INDEXES.GSI2;
    const attempt1 = await super.getItemsByCompositeKey({
      primaryKey: params.username,
      sortKey: sortKey,
      shouldPartialMatchSortKey: true,
      index: index,
      paginationToken: params.paginationToken,
      queryLimit: params.queryLimit
    });
    if (attempt1.data.length !== 0) {
      attempt1.queryHint = {index: index!}
      return attempt1;
    }

    index = DYNAMODB_INDEXES.GSI3;
    const attempt2 = await super.getItemsByCompositeKey({
        primaryKey: params.username,
        sortKey: sortKey,
      shouldPartialMatchSortKey: true,
      index: index,
      paginationToken: params.paginationToken,
      queryLimit: params.queryLimit
    });
    if (attempt2.data.length !== 0) {
      attempt2.queryHint = {index: index!}
      return attempt2;
    }

    index = DYNAMODB_INDEXES.GSI4;
    const attempt3 = await super.getItemsByCompositeKey({
      primaryKey: params.username,
      sortKey: sortKey,
      shouldPartialMatchSortKey: true,
      index: index,
      paginationToken: params.paginationToken,
      queryLimit: params.queryLimit
    });
    if (attempt3.data.length !== 0) {
      attempt3.queryHint = {index: index!}
      return attempt3;
    }

    index = DYNAMODB_INDEXES.GSI5;
    const attempt4 = await super.getItemsByCompositeKey({
      primaryKey: params.username,
      sortKey: sortKey,
      shouldPartialMatchSortKey: true,
      index: index,
      paginationToken: params.paginationToken,
      queryLimit: params.queryLimit
    });
    if (attempt4.data.length !== 0) {
      attempt4.queryHint = {index: index!}
      return attempt4;
    }

    return null;
  }


}

// - Should Convo's be always posted as Talking point posts? Or should they be standalone?
// - Swap sort keys to be POST_<more descriptive identifier> so we can sort between talking points vs other types of posts