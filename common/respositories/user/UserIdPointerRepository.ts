import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserIdPointer, UserIdPointerId } from "../../objects/user/UserIdPointer";
import { Repository } from "../Repository";

export class UserIdPointerRepository extends Repository<UserIdPointer> {

  createPartitionKey = (pointer: UserIdPointer) => {
    return pointer.id.getValue();
  }

  createSortKey = (emailPointer: UserIdPointer) => {
    return [
      UserIdPointerId.IDENTIFIER,
      emailPointer.accountType
    ].join(Repository.compositeKeyDelimeter);
  }

  constructor(client: DynamoDBClient) {
    super(client, UserIdPointer);
  }

  async save(uuidPointer: UserIdPointer) {
    return await super.saveItem({ object: uuidPointer, checkForExistingKey: "COMPOSITE" });
  }

  async getById(id: UserIdPointerId) {
    return await super.getUniqueItemByCompositeKey({
      primaryKey: id.getValue(),
      sortKey: {
        value: UserIdPointerId.IDENTIFIER,
        conditionExpressionType: "BEGINS_WITH",
      },
    });
  }
}