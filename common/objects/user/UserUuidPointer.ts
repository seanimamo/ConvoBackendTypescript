
import { Expose } from 'class-transformer';
import 'reflect-metadata'; //required for class transformer to work;
import { DataValidationError, DataValidator } from '../../util/DataValidator';
import { User } from './User';
/**
 * This class is intended to be used with DynamoDB so that an email can be found for an associated user.
 * Without this object, a GSI would have to be maintained just on a user email.
 * This helps keeps clutter away from GSI's as well as move RCU/WCU's away from the main table.
 */
export class UserUuidPointer {
  @Expose() email: string;
  @Expose() userName: string;
  @Expose() accountType: UserAccountType;

  constructor(userName: string, email: string, accountType: UserAccountType) {
    this.userName = userName;
    this.email = email;
    this.accountType = accountType;
  }

  static fromUser(user: User, accountType: UserAccountType) {
    return new UserUuidPointer(user.userName, user.email, accountType);
  }

  static validate(userEmailPointer: UserUuidPointer) {
    // TODO: Grab validator from singleton source
    const validator: DataValidator = new DataValidator();
    validator.validate(userEmailPointer.email, 'email').notUndefined().notNull().isString().notEmpty();
    validator.validate(userEmailPointer.userName, 'userName').notUndefined().notNull().isString().notEmpty();
    validator.validate(userEmailPointer.accountType, "accountType").notUndefined().notNull().isStringInEnum(UserAccountType);
  }
}

export enum UserAccountType {
  CONVO = "Convo",
  GOOGLE = "Google",
  FACEBOOK = "Facebook",
  APPLE = "Apple",
}