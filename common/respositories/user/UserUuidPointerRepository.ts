import { DynamoDBClient} from "@aws-sdk/client-dynamodb";
import { UserUuidPointer } from "../../objects/user/UserUuidPointer";
import { Repository } from "../Repository";

export class UserUuidPointerRepository extends Repository<UserUuidPointer> {
  static UserUuidPointerIdentifier = "USER_UUID_POINTER";

  createPartitionKey = (emailPointer: UserUuidPointer) => {
    return emailPointer.email;
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

  async getByEmail(email: string) {
    return await super.getUniqueItemByCompositeKey({
      primaryKey: email,
      sortKey: UserUuidPointerRepository.UserUuidPointerIdentifier,
      shouldPartialMatchSortKey: true
    });
  }
}