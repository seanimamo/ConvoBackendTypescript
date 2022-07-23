import 'reflect-metadata'; //required for class transformer to work;
import { Expose } from "class-transformer";
import { DataValidationError, DataValidator } from "../../util/DataValidator";
import TransformDate from "../../util/TransformDate";

export enum UserBanType {
  CLASSIC = "Classic",
  SHADOW = "Shadow",
  PERMANENT = "Permanent"
}

/**
 * Represents the ban status of a user.
 * Note that if isBanned is false then none of the other variables on the object should be defined.
 */
export class UserBanStatus {
  @Expose() type: UserBanType;
  @TransformDate()
  @Expose() createDate?: Date;
  @TransformDate()
  @Expose() expirationDate?: Date;

  constructor(
    type: UserBanType,
    createDate: Date,
    expirationDate: Date,
  ) {
    this.type = type;
    this.createDate = createDate;
    this.expirationDate = expirationDate;
  }

  static validate(banStatus: UserBanStatus) {
    // TODO: Grab validator from singleton source
    const validator = new DataValidator();

    validator.validate(banStatus.type, "type").notUndefined().notNull().isStringInEnum(UserBanType);
    validator.validate(banStatus.createDate, "createDate").notUndefined().notNull().isDate().dateIsNotInFuture();
    validator.validate(banStatus.expirationDate, "expirationDate").notUndefined().notNull().isDate().dateIsNotInPast();
    if (banStatus.expirationDate! <= banStatus.createDate!) {
      throw new DataValidationError("expiration date cannot be on or before create date");
    }
  }
}