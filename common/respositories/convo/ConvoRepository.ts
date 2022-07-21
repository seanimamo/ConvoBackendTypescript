
import { AttributeValue, DynamoDBClient, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Convo, ConvoId, ConvoStatus } from "../../objects/Convo";
import { ObjectId } from "../../objects/ObjectId";
import { DYNAMODB_INDEXES } from "../DynamoDBConstants";
import { InvalidParametersError, ObjectDoesNotExistError } from "../error";
import { PaginatedResponse } from "../PaginatedResponse";
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

class ConvoRepositoryGsiSortKey extends ObjectId {
  public getIdentifier(): string {
    return ConvoId.IDENTIFIER;
  }
}

export class ConvoRepository extends Repository<Convo> {
  createPartitionKey(object: Convo): string {
    return object.id.getValue();
  }

  createSortKey(object: Convo): string {
    return object.id.getValue();
  }

  constructor(client: DynamoDBClient) {
    super(client, Convo);
  }

  async save(convo: Convo) {
    Convo.validate(convo);

    const gsiAttributes: Record<string, AttributeValue> = {}
    const participantUsernameSortKey = new ConvoRepositoryGsiSortKey([convo.createDate]);
    gsiAttributes[`${DYNAMODB_INDEXES.GSI1.partitionKeyName}`] = { S: this.createPartitionKey(convo) };
    gsiAttributes[`${DYNAMODB_INDEXES.GSI1.sortKeyName}`] = { S: participantUsernameSortKey.getValue() };
    gsiAttributes[`${DYNAMODB_INDEXES.GSI2.partitionKeyName}`] = { S: convo.participantUsernames[0] };
    gsiAttributes[`${DYNAMODB_INDEXES.GSI2.sortKeyName}`] = { S: participantUsernameSortKey.getValue() };
    if (convo.participantUsernames.length > 1) {
      gsiAttributes[`${DYNAMODB_INDEXES.GSI3.partitionKeyName}`] = { S: convo.participantUsernames[1] };
      gsiAttributes[`${DYNAMODB_INDEXES.GSI3.sortKeyName}`] = { S: participantUsernameSortKey.getValue() };
    }
    if (convo.participantUsernames.length > 2) {
      gsiAttributes[`${DYNAMODB_INDEXES.GSI4.partitionKeyName}`] = { S: convo.participantUsernames[2] };
      gsiAttributes[`${DYNAMODB_INDEXES.GSI4.sortKeyName}`] = { S: participantUsernameSortKey.getValue() };
    }
    if (convo.participantUsernames.length > 3) {
      gsiAttributes[`${DYNAMODB_INDEXES.GSI5.partitionKeyName}`] = { S: convo.participantUsernames[3] };
      gsiAttributes[`${DYNAMODB_INDEXES.GSI5.sortKeyName}`] = { S: participantUsernameSortKey.getValue() };
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
  async getById(id: ConvoId) {
    return await super.getUniqueItemByCompositeKey({
      primaryKey: id.getValue(),
      sortKey: {
        value: ConvoId.IDENTIFIER,
        conditionExpressionType: "BEGINS_WITH",
      },
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
    const sortKeyValue = ConvoId.IDENTIFIER;
    const authorNameIndexes = [DYNAMODB_INDEXES.GSI2, DYNAMODB_INDEXES.GSI3, DYNAMODB_INDEXES.GSI4, DYNAMODB_INDEXES.GSI5];
    for (let i = 0; i < authorNameIndexes.length; i++) {
      const response = await super.getItemsByCompositeKey({
        primaryKey: params.username,
        sortKey: {
          value: sortKeyValue,
          conditionExpressionType: "BEGINS_WITH"
        },
        index: authorNameIndexes[i],
        paginationToken: params.paginationToken,
        queryLimit: params.queryLimit,
        sortDirection: "DESCENDING"
      });
      if (response.data.length !== 0) {
        response.queryHint = { index: authorNameIndexes[i] }
        return response;
      }
    }
    return new PaginatedResponse([]);
  }

  async acceptConvo(id: ConvoId, username: string) {
    let convo = await this.getById(id) as Convo | null;
    if (convo === null) {
      throw new ObjectDoesNotExistError("Convo does not exist");
    }

    if (!convo.participantUsernames.includes(username)) {
      throw new InvalidParametersError("The provided user is not a participant of the Convo");
    }
    if (convo.acceptedUserNames?.includes(username)) {
      throw new InvalidParametersError("The provided user has already accepted the Convo");
    }

    // Will create a new empty list if acceptedUserNames does not currently exist
    let updateExpression = `SET acceptedUserNames = list_append(if_not_exists(acceptedUserNames, :empty_list), :usernameVal)`
      + `, #statusKey = :statusVal`;
    let expressionVals: Record<string, AttributeValue> = {
      ":usernameVal": { L: [{ S: username }] },
      ":empty_list": { L: [] },
    };
    let expressionNames = {
      "#statusKey": 'status'
    };

    if (convo.acceptedUserNames && convo.acceptedUserNames.length + 1 === convo.participantUsernames.length) {
      // Updates status of convo to ACCEPTED if all participants have accepted or partially accepted if this is the first user.
      expressionVals[':statusVal'] = { S: ConvoStatus.ACCEPTED };
    } else {
      expressionVals[':statusVal'] = { S: ConvoStatus.PARTIALLY_ACCEPTED };
    }

    const updateParams: UpdateItemCommandInput = {
      TableName: process.env.DYNAMO_MAIN_TABLE_NAME!,
      Key: {
        [DYNAMODB_INDEXES.PRIMARY.partitionKeyName]: { S: id.getValue() },
        [DYNAMODB_INDEXES.PRIMARY.sortKeyName]: { S: id.getValue() }
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionVals,
      ExpressionAttributeNames: expressionNames,
      ReturnValues: 'ALL_NEW'
    }

    const response = await this.client.send(new UpdateItemCommand(updateParams));
    return this.serializer.plainJsonToClass(this.itemType, unmarshall(response.Attributes!));
  }

  async rejectConvo(id: ConvoId, username: string) {
    let convo = await this.getById(id) as Convo | null;
    if (convo === null) {
      throw new ObjectDoesNotExistError("Convo does not exist");
    }

    if (!convo.participantUsernames.includes(username)) {
      throw new InvalidParametersError("The provided user is not a participant of the Convo");
    }
    if (convo.rejectedUserNames?.includes(username)) {
      throw new InvalidParametersError("The provided user has already rejected the Convo");
    }
    if (convo.status === ConvoStatus.REJECTED || convo.status === ConvoStatus.CANCELED) {
      throw new InvalidParametersError("Cannot reject a Convo that has a status of REJECTED or CANCELED.");
    }

    // Will create a new empty list if rejectedUserNames does not currently exist
    let updateExpression = `SET rejectedUserNames = list_append(if_not_exists(rejectedUserNames, :empty_list), :usernameVal)`
      + `, #statusKey = :statusVal`;
    let expressionVals: Record<string, AttributeValue> = {
      ":usernameVal": { L: [{ S: username }] },
      ":empty_list": { L: [] },
    };
    let expressionNames = {
      "#statusKey": 'status'
    };

    if (convo.status === ConvoStatus.ACCEPTED) {
      // When a user rejects a convo that has already become accepted the convo becomes CANCELED
      expressionVals[':statusVal'] = { S: ConvoStatus.CANCELED };
    } else {
      // When a user rejects a convo that was not accepted then it becomes REJECTED
      expressionVals[':statusVal'] = { S: ConvoStatus.REJECTED };
    }

    const updateParams: UpdateItemCommandInput = {
      TableName: process.env.DYNAMO_MAIN_TABLE_NAME!,
      Key: {
        [DYNAMODB_INDEXES.PRIMARY.partitionKeyName]: { S: id.getValue() },
        [DYNAMODB_INDEXES.PRIMARY.sortKeyName]: { S: id.getValue() }
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionVals,
      ExpressionAttributeNames: expressionNames,
      ReturnValues: 'ALL_NEW'
    }

    const response = await this.client.send(new UpdateItemCommand(updateParams));
    return this.serializer.plainJsonToClass(this.itemType, unmarshall(response.Attributes!));
  }


}