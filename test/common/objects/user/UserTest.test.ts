import { ClassSerializer } from "../../../../common/objects/ClassSerializer";
import { User } from "../../../../common/objects/user/User";
import { getDummyUser } from "../../../util/DummyFactory";

describe("Test User", () => {
  const plainTextPassword = "test";
  const user = getDummyUser();
  const classSerializer = new ClassSerializer();

  test("Check that transforming the class to and from plain json does not change any data", () => {
    const userPlainJson = classSerializer.classToPlainJson(user);
    console.log("user class turned to plain json: ", userPlainJson);
    const userClassFromPlainJson = classSerializer.plainJsonToClass(User, userPlainJson);
    console.log("user class from  plain json: ", userClassFromPlainJson);
    expect(userClassFromPlainJson.password.isPasswordCorrect(plainTextPassword)).toEqual(true);
    expect(userClassFromPlainJson).toEqual(user);
  });

  test("Check that serializing and deserializing the class does not change any data", () => {
    const userSerialized = classSerializer.serialize(user);
    const userDeserialized = classSerializer.deserialize(User, userSerialized);
    expect(userDeserialized.password.isPasswordCorrect(plainTextPassword)).toEqual(true);
    expect(userDeserialized).toEqual(user);
  });

  test("validate method works properly", () => {
    User.validate(user);
  });

});