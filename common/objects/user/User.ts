import { UserPassword } from "./UserPassword";

export type User = {
  username: string;
  accountType: "CONVO" | "GOOGLE" | "FACEBOOK" | "APPLE";
  password: UserPassword,
  email: string,
  isEmaiValidated: boolean,
  firstName: string,
  lastName: string,
  joinDate: string,
  thumbnail?: string,
  bio?: string,
  occupation?: string,
  convoScore: number,
  followerCount: number,
  followingCount: number,
  settings: UserSettings
}

export type UserSettings = {
  hideRealName: boolean;
}

export type UserBanStatus = {
  type: "BASIC" | "SHADOW";
  expirationDate: Date;
}