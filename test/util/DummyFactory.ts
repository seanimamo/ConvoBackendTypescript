import { User, UserAccountType } from "../../common/objects/user/User";
import { UserPassword } from "../../common/objects/user/UserPassword";

// Note that ban status was left off, an unbanned user wont have a value.
export const getDummyUser = () => {
  return User.builder({
    username: "testusername",
    accountType: UserAccountType.CONVO,
    password: UserPassword.fromPlainTextPassword('test'),
    email: "string",
    isEmailValidated: true,
    firstName: "string",
    lastName: "string",
    joinDate: new Date("2022-01-01").toUTCString(),
    thumbnail: "string",
    bio: "string",
    occupation: "string",
    convoScore: 0,
    followerCount: 0,
    followingCount: 0,
    settings: {
      hideRealName: false
    }
  });
}