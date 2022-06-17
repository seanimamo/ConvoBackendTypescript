
import { Expose } from 'class-transformer';
import 'reflect-metadata'; //required for class transformer to work;
import { DataValidator } from '../../util/DataValidator';
import { User } from './User';
/**
 * This class is intended to be used with DynamoDB for two purposes:
 * 1) To enable users to be looked up using an email address. This enables us to confirm whether an email already exists.
 * 2) To create a pointer for oauth logins. For example, if someone logs in with google we can see if that email is already attached to another
 * account and, if so, link the two accounts. 
 * 
 */
export class UserUuidPointer {
  @Expose() uuid: string; // This could be an email, phonenumber, or username with a different oauth account.
  @Expose() userName: string;
  @Expose() accountType: UserAccountType;

  constructor(uuid: string, userName: string,accountType: UserAccountType) {
    this.uuid = uuid;
    this.userName = userName;
    this.accountType = accountType;
  }

  static fromUser(user: User, accountType: UserAccountType) {
    return new UserUuidPointer(user.email, user.userName, accountType);
  }

  static validate(userEmailPointer: UserUuidPointer) {
    // TODO: Grab validator from singleton source
    const validator: DataValidator = new DataValidator();
    validator.validate(userEmailPointer.uuid, 'uuid').notUndefined().notNull().isString().notEmpty();
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