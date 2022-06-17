import { DynamoDBClient} from "@aws-sdk/client-dynamodb";
import { UserUuidPointer } from "../../objects/user/UserUuidPointer";
import { Repository } from "../Repository";

export class UserUuidPointerRepository extends Repository<UserUuidPointer> {
  static UserUuidPointerIdentifier = "USER_UUID_POINTER";

  createPartitionKey = (pointer: UserUuidPointer) => {
    return pointer.uuid;
  }

  createSortKey = (emailPointer: UserUuidPointer) => {
    return [
      UserUuidPointerRepository.UserUuidPointerIdentifier,
      emailPointer.accountType
    ].join(Repository.compositeKeyDelimeter);
  }

  constructor(client: DynamoDBClient) {
    super(client, UserUuidPointer);
  }

  async save(uuidPointer: UserUuidPointer) {
    return await super.saveItem({object: uuidPointer, checkForExistingKey: "COMPOSITE"});
  }

  async getByUuid(uuid: string) {
    return await super.getUniqueItemByCompositeKey({
      primaryKey: uuid,
      sortKey: UserUuidPointerRepository.UserUuidPointerIdentifier,
      shouldPartialMatchSortKey: true
    });
  }
}