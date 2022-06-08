
import { User } from "../../../common/objects/user/User";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";
import { getDummyUser } from "../../util/DummyFactory";
import { UserAccountType, UserUuidPointer } from "../../../common/objects/user/UserUuidPointer";
import { UserUuidPointerRepository } from "../../../common/respositories/user/UserUuidPointerRepository";
import { UniqueObjectAlreadyExistsError } from "../../../common/respositories/error";

let v3Client: DynamoDBClient;
let userUuidRepo: UserUuidPointerRepository;
let user: User;
let userPointer: UserUuidPointer;
jest.setTimeout(100000);

beforeAll(async () => {
  await startDb();
  console.log("process.env.MOCK_DYNAMODB_ENDPOINT: ", process.env.MOCK_DYNAMODB_ENDPOINT)

  v3Client = new DynamoDBClient({
    region: "us-east-1",
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT
  });
  userUuidRepo = new UserUuidPointerRepository(v3Client);
});

beforeEach(async () => {
  await createTables();
  user = getDummyUser();
  userPointer = new UserUuidPointer("testusername", "test@gmail.com", UserAccountType.CONVO);
})

afterEach(async () => {
  await deleteTables();
})

afterAll(async () => {
  v3Client.destroy();
  stopDb();
})

describe("Test UserUuidRepository", () => {
  test("Saving new user uuid pointer succeeds", async () => {
    await userUuidRepo.save(userPointer);
  });

  test("Saving a new user with a prexisting email fails", async () => {
    await userUuidRepo.save(userPointer);
    const newUserPointerDuplicateEmail = new UserUuidPointer("ADifferentUsername", userPointer.email, userPointer.accountType);
    await expect(userUuidRepo.save(newUserPointerDuplicateEmail)).rejects.toThrow(UniqueObjectAlreadyExistsError);
  });

});
