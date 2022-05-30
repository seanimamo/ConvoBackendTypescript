import { ClassSerializer } from "../../../../common/objects/ClassSerializer";
import { User } from "../../../../common/objects/user/User";
import { UserPassword } from "../../../../common/objects/user/UserPassword";

describe("Test User", () => {
  const plainTextPassword = "test";
  // Note that ban status was left off, an unbanned user wont have a value.
  const user: User = User.builder({
    username: "string",
    accountType: "CONVO",
    password: UserPassword.fromPlainTextPassword(plainTextPassword),
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
  });
  const classSerializer = new ClassSerializer();

  test("Check that transforming the class to and from plain json does not change any data", () => {
    const userPlainJson = classSerializer.classToPlainJson(user);
    // console.log("user class turned to plain json: ", userPlainJson);
    const userClassFromPlainJson = classSerializer.plainJsonToClass(User, userPlainJson);
    // console.log("user class from  plain json: ", userClassFromPlainJson);
    expect(userClassFromPlainJson.password.isPasswordCorrect(plainTextPassword)).toEqual(true);
    expect(userClassFromPlainJson).toEqual(user);
  });

  test("Check that serializing and deserializing the class does not change any data", () => {
    const userSerialized = classSerializer.serialize(user);
    const userDeserialized = classSerializer.deserialize(User, userSerialized);
    expect(userDeserialized.password.isPasswordCorrect(plainTextPassword)).toEqual(true);
    expect(userDeserialized).toEqual(user);
  });

});