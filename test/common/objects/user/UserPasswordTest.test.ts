import { ClassSerializer } from "../../../../common/util/ClassSerializer";
import { User } from "../../../../common/objects/user/User";
import { UserPassword } from "../../../../common/objects/user/UserPassword";

describe("Test UserPassword logic", () => {

  const plainTextPassword = "testPwrd";
  const userPassword = UserPassword.fromPlainTextPassword(plainTextPassword);
  const classSerializer = new ClassSerializer();

  test("Check the correct password returns true", () => {
    expect(userPassword.isPasswordCorrect(plainTextPassword)).toEqual(true);
  });

  test("Check the wrong password returns false", () => {
    expect(userPassword.isPasswordCorrect("incorrectPwrd")).toEqual(false);
  });

  test("Check that transforming the class to and from plain json does not change any data", () => {
    const passwordPlainJson = classSerializer.classToPlainJson(userPassword);
    // console.log("passwordPlainJson", passwordPlainJson);
    const passwordClassFromPlainJson = classSerializer.plainJsonToClass(UserPassword, passwordPlainJson);
    expect(passwordClassFromPlainJson.isPasswordCorrect(plainTextPassword)).toEqual(true);
    expect(passwordClassFromPlainJson).toEqual(userPassword);
  });

  test("Check that serializing and deserializing the class does not change any data", () => {
    const userPasswordSerialized = classSerializer.serialize(userPassword);
    const userPasswordDeserialized = classSerializer.deserialize(UserPassword, userPasswordSerialized);
    expect(userPasswordDeserialized.isPasswordCorrect(plainTextPassword)).toEqual(true);
    expect(userPasswordDeserialized).toEqual(userPassword);
  });
 
});