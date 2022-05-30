import { User } from "../../../../common/objects/user/User";
import { UserPassword } from "../../../../common/objects/user/UserPassword";

describe("Test User", () => {
  test("Check that serializing and deserializing a user does not change its data", () => {
    const user1: User = {
      username: "string",
      accountType: "CONVO",
      password: new UserPassword("test"),
      email: "string",
      isEmaiValidated: true,
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
    }

    // NEED TO USE CLASS TRANSFORMER TO GET THIS TO WORK.
    // const user1Serialized = JSON.stringify(user1);
    // const user1Deserialized = JSON.parse(user1Serialized) as User;
    // console.log(user1Deserialized.password.isPasswordCorrect("test"));
  });

});