import { ClassSerializer } from "../../../../common/util/ClassSerializer";
import { User, UserId } from "../../../../common/objects/user/User";
import { getDummyUser } from "../../../util/DummyFactory";
import { DataValidationError } from "../../../../common/util/DataValidator";
import { ObjectId } from "../../../../common/objects/ObjectId";

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

  test("validate() - succesfully validates a valid object", () => {
    expect(User.validate(user)).toBeUndefined();
  });

  test("validate() - throws error with invalid object", () => {
    const userPlainJson = classSerializer.classToPlainJson(user);
    userPlainJson['userName'] = undefined;
    const userClassFromPlainJson = classSerializer.plainJsonToClass(User, userPlainJson);
    expect(() => User.validate(userClassFromPlainJson)).toThrowError(DataValidationError);
  });

  test("UserId - is formatted as expected", () => {
    const params = {userName: "test123"}
    const userId = new UserId(params);
    const parsedId = ObjectId.parseId(userId);
    expect(parsedId[0]).toStrictEqual(UserId.IDENTIFIER);
    expect(parsedId[1]).toStrictEqual(params.userName);
  });

});