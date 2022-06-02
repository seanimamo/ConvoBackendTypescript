
import { User, UserAccountType } from "../../../common/objects/user/User";
import { UserPassword } from "../../../common/objects/user/UserPassword";
import { UserRepository } from "../../../common/respositories/UserRepository";
import { ConditionalCheckFailedException, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";
import { ObjectAlreadyExistsError } from "../../../common/respositories/error/ObjectAlreadyExistsError";
import { getDummyUser } from "../../util/DummyFactory";
import { classToClassFromExist } from "class-transformer";
import { ObjectDoesNotExistError } from "../../../common/respositories/error/ObjectDoesNotExistError";

let v3Client: DynamoDBClient;
let userRepository: UserRepository;
let user: User;
jest.setTimeout(100000);

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

  test("Getting an existing user succeeds", async () => {
    await userRepository.save(user);
    await expect(userRepository.getByUsername(user.username)).resolves.toEqual(user);
  });
  
  test("Getting a nonexistant user returns null", async () => {
    await userRepository.save(user);
    await expect(userRepository.getByUsername(user.username + 'asd')).resolves.toBeNull();
  });

  test("Saving a user with a prexisting username fails", async () => {
    await userRepository.save(user);
    await expect(userRepository.save(user)).rejects.toThrow(ObjectAlreadyExistsError);
  });

  test("Updating user IsEmailValidated works", async () => {
    await userRepository.save(user);
    await userRepository.updateIsEmailValidated(user.username, !user.isEmailValidated);
    const updatedUser = await userRepository.getByUsername(user.username) as User;
    expect(updatedUser.isEmailValidated).toEqual(!user.isEmailValidated);
  });

  test("Updating user IsEmailValidated fails if user does not exist", async () => {
    await expect(userRepository.updateIsEmailValidated("userThatDoesntExisttt", user.isEmailValidated))
    .rejects
    .toThrow(ObjectDoesNotExistError);
  });

});
