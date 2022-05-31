import 'reflect-metadata'; //required for class transformer to work;
import { UserPassword } from "./UserPassword";
import { Expose, Type } from 'class-transformer';

export class User {
  @Expose() username: string;
  @Expose() accountType: "CONVO" | "GOOGLE" | "FACEBOOK" | "APPLE";
  @Type(() => UserPassword)
  @Expose() password: UserPassword;
  @Expose() email: string;
  @Expose() isEmaiValidated: boolean;
  @Expose() firstName: string;
  @Expose() lastName: string;
  @Expose() joinDate: string;
  @Expose() convoScore: number;
  @Expose() followerCount: number;
  @Expose() followingCount: number;
  @Expose() settings: UserSettings;
  // @Expose() banStatus?: UserBanStatus; uncomment when ready to add functionality
  @Expose() thumbnail?: string;
  @Expose() bio?: string;
  @Expose() occupation?: string;

  constructor(username: string,
    accountType: "CONVO" | "GOOGLE" | "FACEBOOK" | "APPLE",
    password: UserPassword,
    email: string,
    isEmaiValidated: boolean,
    firstName: string,
    lastName: string,
    joinDate: string,
    convoScore: number,
    followerCount: number,
    followingCount: number,
    settings: UserSettings,
    // banStatus?: UserBanStatus, uncomment when ready to add functionality
    thumbnail?: string,
    bio?: string,
    occupation?: string) {
    this.username = username;
    this.accountType = accountType;
    this.password = password;
    this.email = email;
    this.isEmaiValidated = isEmaiValidated;
    this.firstName = firstName;
    this.lastName = lastName;
    this.joinDate = joinDate;
    this.convoScore = convoScore;
    this.followerCount = followerCount;
    this.followingCount = followingCount;
    this.settings = settings;
    // this.banStatus = banStatus; uncomment when ready to add functionality
    this.thumbnail = thumbnail;
    this.bio = bio;
    this.occupation = occupation;
  }

  static builder(
    props: {
      username: string;
      accountType: "CONVO" | "GOOGLE" | "FACEBOOK" | "APPLE";
      password: UserPassword,
      email: string,
      isEmaiValidated: boolean,
      firstName: string,
      lastName: string,
      joinDate: string,
      convoScore: number,
      followerCount: number,
      followingCount: number,
      settings: UserSettings,
      // banStatus?: UserBanStatus; uncomment when ready to add functionality
      thumbnail?: string,
      bio?: string,
      occupation?: string,
    }
  ) {
    return new User(
      props.username,
      props.accountType,
      props.password,
      props.email,
      props.isEmaiValidated,
      props.firstName,
      props.lastName,
      props.joinDate,
      props.convoScore,
      props.followerCount,
      props.followingCount,
      props.settings,
      // props.banStatus, uncomment when ready to add functionality
      props.thumbnail,
      props.bio,
      props.occupation,
    )
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