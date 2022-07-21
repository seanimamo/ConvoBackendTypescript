
import { User, UserId } from "../../../../common/objects/user/User";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";
import { getDummyUser } from "../../../util/DummyFactory";
import { UserAccountType, UserIdPointer, UserIdPointerId } from "../../../../common/objects/user/UserIdPointer";
import { UserIdPointerRepository } from "../../../../common/respositories/user/UserIdPointerRepository";
import { UniqueObjectAlreadyExistsError } from "../../../../common/respositories/error";

let v3Client: DynamoDBClient;
let userUuidRepo: UserIdPointerRepository;
let user: User;
let userPointer: UserIdPointer;
jest.setTimeout(100000);

beforeAll(async () => {
  await startDb();

  v3Client = new DynamoDBClient({
    region: "us-east-1",
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT
  });
  userUuidRepo = new UserIdPointerRepository(v3Client);
});

beforeEach(async () => {
  await createTables();
  user = getDummyUser();
  userPointer = new UserIdPointer(
    new UserIdPointerId({ uuid: "test@gmail.com" }),
    new UserId({ userName: "test@gmail.com" }),
    UserAccountType.CONVO
  );
})

afterEach(async () => {
  await deleteTables();
})

afterAll(async () => {
  await v3Client.destroy();
  await stopDb();
})

describe("Test UserUuidRepository", () => {
  test("Saving new user uuid pointer succeeds", async () => {
    await userUuidRepo.save(userPointer);
  });

  test("Saving a new user with a prexisting email fails", async () => {
    await userUuidRepo.save(userPointer);
    const newUserPointerDuplicateEmail = new UserIdPointer(userPointer.id, new UserId({ userName: "ADifferentUsername" }), userPointer.accountType);
    await expect(userUuidRepo.save(newUserPointerDuplicateEmail)).rejects.toThrow(UniqueObjectAlreadyExistsError);
  });

});
