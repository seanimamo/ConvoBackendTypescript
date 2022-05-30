import { User } from "../../../../common/objects/user/User";
import { UserPassword } from "../../../../common/objects/user/UserPassword";

describe("Test UserPassword logic", () => {

  const plainTextPassword = "testPwrd";
  const userPassword = new UserPassword(plainTextPassword);

  test("Check the correct password returns true", () => {
    expect(userPassword.isPasswordCorrect(plainTextPassword)).toEqual(true);
  });

  test("Check the wrong password returns false", () => {
    expect(userPassword.isPasswordCorrect("incorrectPwrd")).toEqual(false);
  });

});