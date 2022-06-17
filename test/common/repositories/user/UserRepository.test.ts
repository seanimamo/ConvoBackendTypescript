
import { User } from "../../../../common/objects/user/User";
import { UserRepository } from "../../../../common/respositories/user/UserRepository";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";
import { getDummyUser } from "../../../util/DummyFactory";
import { EmailAlreadyInUseError, UsernameAlreadyInUseError } from "../../../../common/respositories/user/error";
import { ObjectDoesNotExistError } from "../../../../common/respositories/error";
import { UserPassword } from "../../../../common/objects/user/UserPassword";
import { UserBanType } from "../../../../common/objects/user/UserBanStatus";
import { marshall } from "@aws-sdk/util-dynamodb";
import { ClassSerializer } from "../../../../common/util/ClassSerializer";

let v3Client: DynamoDBClient;
let userRepository: UserRepository;
let user: User;
jest.setTimeout(1000000);

beforeAll(async () => {
  await startDb();
  console.log("process.env.MOCK_DYNAMODB_ENDPOINT: ", process.env.MOCK_DYNAMODB_ENDPOINT)

  v3Client = new DynamoDBClient({
    region: "us-east-1",
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT
  });
  userRepository = new UserRepository(v3Client);
});

beforeEach(async () => {
  await createTables();
  user = getDummyUser();
})

afterEach(async () => {
  await deleteTables();
})

afterAll(async () => {
  v3Client.destroy();
  stopDb();
})

describe("Test User Repository", () => {
  test("Saving new user succeeds", async () => {
    await userRepository.save(user);
  });

  test("Getting an existing user by userName succeeds", async () => {
    await userRepository.save(user);
    await expect(userRepository.getByUsername(user.userName)).resolves.toEqual(user);
  });

  test("Getting a nonexistant user by userName returns null", async () => {
    await userRepository.save(user);
    await expect(userRepository.getByUsername(user.userName + 'asd')).resolves.toBeNull();
  });

  test("Saving a user with a prexisting userName fails", async () => {
    await userRepository.save(user);
    user.email = "aDiffEmail@gmail.com";
    await expect(userRepository.save(user)).rejects.toThrow(UsernameAlreadyInUseError);
  });

  test("Saving a user with a prexisting email fails", async () => {
    await userRepository.save(user);
    const newUserWithDuplicateEmail = getDummyUser();
    newUserWithDuplicateEmail.userName = "aDifferentUsername";
    newUserWithDuplicateEmail.email = user.email;
    await expect(userRepository.save(newUserWithDuplicateEmail)).rejects.toThrow(EmailAlreadyInUseError);
  });

  test("Updating user IsEmailValidated works", async () => {
    await userRepository.save(user);
    await userRepository.updateIsEmailValidated(user.userName, !user.isEmailValidated);
    const updatedUser = await userRepository.getByUsername(user.userName) as User;
    expect(updatedUser.isEmailValidated).toEqual(!user.isEmailValidated);
  });

  test("Updating user IsEmailValidated fails if user does not exist", async () => {
    await expect(userRepository.updateIsEmailValidated("userThatDoesntExisttt", user.isEmailValidated))
    .rejects
    .toThrow(ObjectDoesNotExistError);
  });

});
