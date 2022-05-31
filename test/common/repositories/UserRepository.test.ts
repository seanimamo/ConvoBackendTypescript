
import { User } from "../../../common/objects/user/User";
import { UserPassword } from "../../../common/objects/user/UserPassword";
import { UserRepository } from "../../../common/respositories/UserRepository";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";

let v3Client: DynamoDBClient;
jest.setTimeout(100000);

beforeAll(async () => {
  await startDb();
  console.log("process.env.MOCK_DYNAMODB_ENDPOINT: ", process.env.MOCK_DYNAMODB_ENDPOINT)

  v3Client = new DynamoDBClient({
    region: "us-east-1",
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT
  });
});

beforeEach(async () => {
  await createTables();
})

afterEach(async () => {
  await deleteTables();
})

afterAll(async () => {
  v3Client.destroy();
  stopDb();
})

describe("Test Dynamo", () => {
  const user: User = User.builder({
    username: "testusername",
    accountType: "CONVO",
    password: UserPassword.fromPlainTextPassword('test'),
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

  test("Test saving new user succeeds", async () => {
    const userRepository = new UserRepository(v3Client);
    try {
      const response = await userRepository.save(user);
      console.log("Successful save", response);
    } catch (error) {
      console.log("failed to save", error);
    }
  });

  test("Test saving and getting user succeeds", async () => {
    const userRepository = new UserRepository(v3Client);

    try {
      const response = await userRepository.save(user);
      console.log("Successful save", response);
    } catch (error) {
      console.log("failed to save", error);
    }

    try {
      const response = await userRepository.getByUsername(user.username);
      console.log("Successful get: ", response);
    } catch (error) {
      console.log("failed to get: ", error);
    }

  });

});