import 'reflect-metadata'; //required for class transformer to work;
import { UserPassword } from "./UserPassword";
import { Expose, Type } from 'class-transformer';
import { DataValidator } from '../../util/DataValidator';
import TransformDate from '../../util/TransformDate';

export class User {
  @Expose() username: string;
  @Type(() => UserPassword)
  @Expose() password: UserPassword;
  @Expose() email: string;
  @Expose() isEmailValidated: boolean;
  @Expose() firstName: string;
  @Expose() lastName: string;
  @TransformDate()
  @Expose() joinDate: Date;
  @Expose() convoScore: number;
  @Expose() followerCount: number;
  @Expose() followingCount: number;
  @Expose() settings: UserSettings;
  // @Expose() banStatus?: UserBanStatus; uncomment when ready to add functionality
  @TransformDate()
  @Expose() birthDate?: Date;
  @Expose() thumbnail?: string;
  @Expose() bio?: string;
  @Expose() occupation?: string;
  @Expose() location?: string;

  constructor(username: string,
    password: UserPassword,
    email: string,
    isEmailValidated: boolean,
    firstName: string,
    lastName: string,
    joinDate: Date,
    convoScore: number,
    followerCount: number,
    followingCount: number,
    settings: UserSettings,
    // banStatus?: UserBanStatus, uncomment when ready to add functionality
    birthDate?: Date,
    thumbnail?: string,
    bio?: string,
    occupation?: string,
    location?: string) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.isEmailValidated = isEmailValidated;
    this.firstName = firstName;
    this.lastName = lastName;
    this.joinDate = joinDate;
    this.birthDate = birthDate;
    this.convoScore = convoScore;
    this.followerCount = followerCount;
    this.followingCount = followingCount;
    this.settings = settings;
    // this.banStatus = banStatus; uncomment when ready to add functionality
    this.thumbnail = thumbnail;
    this.bio = bio;
    this.occupation = occupation;
    this.location = location;
  }

  static builder(
    props: {
      username: string;
      password: UserPassword,
      email: string,
      isEmailValidated: boolean,
      firstName: string,
      lastName: string,
      joinDate: Date,
      convoScore: number,
      followerCount: number,
      followingCount: number,
      settings: UserSettings,
      // banStatus?: UserBanStatus; uncomment when ready to add functionality
      birthDate?: Date,
      thumbnail?: string,
      bio?: string,
      occupation?: string,
      location?: string
    }
  ) {
    return new User(
      props.username,
      props.password,
      props.email,
      props.isEmailValidated,
      props.firstName,
      props.lastName,
      props.joinDate,
      props.convoScore,
      props.followerCount,
      props.followingCount,
      props.settings,
      // props.banStatus, uncomment when ready to add functionality
      props.birthDate,
      props.thumbnail,
      props.bio,
      props.occupation,
      props.location
    )
  }

  static validate(user: User) {
    // TODO: Grab validator from singleton source
    const validator: DataValidator = new DataValidator();

    // TODO: add complex more username format/constraints validation
    validator.validate(user.username, 'username').notUndefined().notNull().isString().notEmpty();
    // TODO: add complex user email format validation
    validator.validate(user.email, 'email').notUndefined().notNull().isString().notEmpty();
    validator.validate(user.isEmailValidated, 'isEmailValidated').notUndefined().notNull().isBoolean();
    // TODO: add complex user password format/constraints validation
    validator.validate(user.password, 'password').notUndefined().notNull();
    validator.validate(user.firstName, 'firstName').notUndefined().notNull().isString().notEmpty();
    validator.validate(user.lastName, 'lastName').notUndefined().notNull().isString().notEmpty();
    validator.validate(user.joinDate, 'joinDate').notUndefined().notNull().isDate().dateIsNotInFuture();
    validator.validate(user.convoScore, 'convoScore').notUndefined().notNull().isNumber();
    validator.validate(user.followerCount, 'followerCount').notUndefined().notNull().isNumber();
    validator.validate(user.followingCount, 'followingCount').notUndefined().notNull().isNumber();
    // TODO: add complex user settings contraints validation
    validator.validate(user.settings, 'settings').notUndefined().notNull();

    // Optional properties
    // TODO: add complex user birthDate contraints validation
    if (user.birthDate !== undefined) {
      validator.validate(user.birthDate, 'birthDate').notNull().dateIsNotInFuture();
    }
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
  }
}

export type UserSettings = {
  hideRealName: boolean;
}

// uncomment when ready to add functionality
// export type UserBanStatus = {
//   type: "BASIC" | "SHADOW";
//   expirationDate: Date;
// }