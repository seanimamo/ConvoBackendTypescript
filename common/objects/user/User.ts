import 'reflect-metadata'; //required for class transformer to work;
import { UserPassword } from "./UserPassword";
import { UserBanStatus } from "./UserBanStatus";
import { Expose, Type } from 'class-transformer';
import { DataValidationError, DataValidator } from '../../util/DataValidator';
import TransformDate from '../../util/TransformDate';
import { ObjectId } from '../ObjectId';
import TransformObjectId from '../../util/TransformObjectId';

export class UserId extends ObjectId {
  public static readonly IDENTIFIER = "USER";

  constructor(params: { userName: string } | string) {
    typeof (params) === 'string'
      ? super(params)
      : super([params.userName]);
  }

  protected getIdentifier(): string {
    return UserId.IDENTIFIER;
  }
}


export class User {
  @TransformObjectId()
  @Expose() id: UserId
  @Expose() userName: string;
  @Type(() => UserPassword)
  @Expose() password: UserPassword;
  @Expose() email: string;
  @Expose() isEmailValidated: boolean;
  @Expose() firstName: string;
  @Expose() lastName: string;
  @TransformDate()
  @Expose() joinDate: Date;
  @Expose() metrics: {
    convoScore: number;
    followerCount: number;
    followingCount: number;
  };
  @Expose() settings: UserSettings;
  @Expose() banStatus: UserBanStatus;
  @TransformDate()
  @Expose() birthDate?: Date;
  @Expose() thumbnail?: string;
  @Expose() bio?: string;
  @Expose() occupation?: string;
  @Expose() location?: string;
  @Expose() profession?: string;

  constructor(
    id: UserId | null,
    userName: string,
    password: UserPassword,
    email: string,
    isEmailValidated: boolean,
    firstName: string,
    lastName: string,
    joinDate: Date,
    metrics: {
      convoScore: number;
      followerCount: number;
      followingCount: number;
    },
    settings: UserSettings,
    banStatus: UserBanStatus,
    birthDate?: Date,
    thumbnail?: string,
    bio?: string,
    occupation?: string,
    location?: string,
    profession?: string) {
    if (id === null) {
      this.id = new UserId({ userName });
    } else {
      this.id = id;
    }
    this.userName = userName;
    this.password = password;
    this.email = email;
    this.isEmailValidated = isEmailValidated;
    this.firstName = firstName;
    this.lastName = lastName;
    this.joinDate = joinDate;
    this.birthDate = birthDate;
    this.metrics = metrics;
    this.settings = settings;
    this.banStatus = banStatus;
    this.thumbnail = thumbnail;
    this.bio = bio;
    this.occupation = occupation;
    this.location = location;
    this.profession = profession;
  }

  static builder(
    props: {
      id: UserId | null;
      userName: string;
      password: UserPassword,
      email: string,
      isEmailValidated: boolean,
      firstName: string,
      lastName: string,
      joinDate: Date,
      metrics: {
        convoScore: number;
        followerCount: number;
        followingCount: number;
      },
      settings: UserSettings,
      banStatus: UserBanStatus,
      birthDate?: Date,
      thumbnail?: string,
      bio?: string,
      occupation?: string,
      location?: string,
      profession?: string
    }
  ) {
    return new User(
      props.id,
      props.userName,
      props.password,
      props.email,
      props.isEmailValidated,
      props.firstName,
      props.lastName,
      props.joinDate,
      props.metrics,
      props.settings,
      props.banStatus,
      props.birthDate,
      props.thumbnail,
      props.bio,
      props.occupation,
      props.location,
      props.profession
    )
  }

  static validate(user: User) {
    // TODO: Grab validator from singleton source
    const validator: DataValidator = new DataValidator();
    const partitionedId = ObjectId.parseId(user.id);
    if (partitionedId[0] !== UserId.IDENTIFIER) {
      throw new DataValidationError("objectIdentifier is not first value in provided id");
    }
    if (partitionedId[1] !== user.userName) {
      throw new DataValidationError("username is not second value in provided id");
    }
    validator.validate(user.id, 'id').notUndefined().notNull();

    // TODO: add complex more userName format/constraints validation
    validator.validate(user.userName, 'userName').notUndefined().notNull().isString().notEmpty();
    // TODO: add complex user email format validation
    validator.validate(user.email, 'email').notUndefined().notNull().isString().notEmpty();
    validator.validate(user.isEmailValidated, 'isEmailValidated').notUndefined().notNull().isBoolean();
    // TODO: add complex user password format/constraints validation
    validator.validate(user.password, 'password').notUndefined().notNull();
    validator.validate(user.firstName, 'firstName').notUndefined().notNull().isString().notEmpty();
    validator.validate(user.lastName, 'lastName').notUndefined().notNull().isString().notEmpty();
    validator.validate(user.joinDate, 'joinDate').notUndefined().notNull().isDate().dateIsNotInFuture();
    validator.validate(user.metrics.convoScore, 'metrics.convoScore').notUndefined().notNull().isNumber().notNegative();
    validator.validate(user.metrics.followerCount, 'metrics.followerCount').notUndefined().notNull().isNumber().notNegative();
    validator.validate(user.metrics.followingCount, 'metrics.followingCount').notUndefined().notNull().isNumber().notNegative();

    UserBanStatus.validate(user.banStatus);

    // TODO: add complex user settings contraints validation
    validator.validate(user.settings, 'settings').notUndefined().notNull();

    // Optional properties
    // TODO: add complex user birthDate contraints validation
    if (user.birthDate !== undefined) {
      validator.validate(user.birthDate, 'birthDate').notNull().dateIsNotInFuture();
    }
    // TODO: add complex user thumbnail format contraints validation
    if (user.thumbnail !== undefined) {
      validator.validate(user.thumbnail, 'thumbnail').notNull().notEmpty().isString();
    }
    if (user.occupation !== undefined) {
      validator.validate(user.occupation, 'occupation').notNull().notEmpty().isString();
    }
    if (user.bio !== undefined) {
      validator.validate(user.bio, 'bio').notNull().notEmpty().isString();
    }
    if (user.location !== undefined) {
      validator.validate(user.location, 'location').notNull().notEmpty().isString();
    }
    if (user.profession !== undefined) {
      validator.validate(user.profession, 'profession').notNull().notEmpty().isString();
    }
  }
}

export type UserSettings = {
  hideRealName: boolean;
}