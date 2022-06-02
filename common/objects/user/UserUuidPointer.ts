
import 'reflect-metadata'; //required for class transformer to work;
import { DataValidator } from '../../util/DataValidator';
import { User } from './User';
/**
 * This class is intended to be used with DynamoDB so that an email can be found for an associated user.
 * Without this object, a GSI would have to be maintained just on a user email.
 * This helps keeps clutter away from GSI's as well as move RCU/WCU's away from the main table.
 */
export class UserUuidPointer {
  email: string;
  username: string;
  accountType: UserAccountType;

  constructor(username: string, email: string, accountType: UserAccountType) {
    this.username = username;
    this.email = email;
    this.accountType = accountType;
  }

  static fromUser(user: User, accountType: UserAccountType) {
    return new UserUuidPointer(user.username, user.email, accountType);
  }

  static validate(userEmailPointer: UserUuidPointer) {
    // TODO: Grab validator from singleton source
    const validator: DataValidator = new DataValidator();

    validator.validate(userEmailPointer.email, 'email').notUndefined().notNull().isString().notEmpty();
    validator.validate(userEmailPointer.username, 'username').notUndefined().notNull().isString().notEmpty();
    validator.validate(userEmailPointer.accountType, 'accountType').notUndefined().notNull().isString().notEmpty();
  }
}

export enum UserAccountType {
  CONVO = "CONVO",
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
  APPLE = "APPLE",
}