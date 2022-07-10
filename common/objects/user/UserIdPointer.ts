
import 'reflect-metadata'; //required for class transformer to work;
import { Expose } from 'class-transformer';
import { DataValidator } from '../../util/DataValidator';
import TransformObjectId from '../../util/TransformObjectId';
import { ObjectId } from '../ObjectId';
import { User, UserId } from './User';
/**
 * This class is intended to be used with DynamoDB for two purposes:
 * 1) To enable users to be looked up using an email address. This enables us to confirm whether an email already exists.
 * 2) To create a pointer for oauth logins. For example, if someone logs in with google we can see if that email is already attached to another
 * account and, if so, link the two accounts. 
 * 
 */

export class UserIdPointerId extends ObjectId{
  public static readonly IDENTIFIER = "USER_UUID_POINTER";

  constructor(params: { uuid: string } | string) {
      typeof (params) === 'string'
          ? super(params)
          : super([params.uuid]);
  }

  public getIdentifier(): string {
      return UserIdPointerId.IDENTIFIER;
  }
}

export class UserIdPointer {
  @TransformObjectId()
  @Expose() id: UserIdPointerId; // This could be an email, phonenumber, or username with a different oauth account.
  @TransformObjectId()
  @Expose() userId: UserId;
  @Expose() accountType: UserAccountType;

  constructor(id: UserIdPointerId, userId: UserId, accountType: UserAccountType) {
    this.id = id;
    this.userId = userId;
    this.accountType = accountType;
  }

  static fromUser(user: User, accountType: UserAccountType) {
    return new UserIdPointer(new UserIdPointerId({uuid: user.email}), user.id, accountType);
  }

  static validate(userPointer: UserIdPointer) {
    // TODO: Grab validator from singleton source
    const validator: DataValidator = new DataValidator();
    validator.validate(userPointer.id, 'id').notUndefined().notNull();
    validator.validate(userPointer.userId, 'userId').notUndefined().notNull();
    validator.validate(userPointer.accountType, "accountType").notUndefined().notNull().isStringInEnum(UserAccountType);
  }
}

export enum UserAccountType {
  CONVO = "Convo",
  GOOGLE = "Google",
  FACEBOOK = "Facebook",
  APPLE = "Apple",
}