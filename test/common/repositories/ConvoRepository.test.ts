
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";
import { getDummyConvo } from "../../util/DummyFactory";
import { UniqueObjectAlreadyExistsError } from "../../../common/respositories/error";
import { ConvoRepository } from "../../../common/respositories/talking-point-post/ConvoRepository";
import { Convo } from "../../../common/objects/Convo";

let v3Client: DynamoDBClient;
let convoRepository: ConvoRepository;
let convo: Convo;
jest.setTimeout(10000);

beforeAll(async () => {
  await startDb();
  console.log("process.env.MOCK_DYNAMODB_ENDPOINT: ", process.env.MOCK_DYNAMODB_ENDPOINT)

  v3Client = new DynamoDBClient({
    region: "us-east-1",
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT
  });
  convoRepository = new ConvoRepository(v3Client);
});

beforeEach(async () => {
  await createTables();
  convo = getDummyConvo();
})

afterEach(async () => {
  await deleteTables();
})

afterAll(async () => {
  v3Client.destroy();
  stopDb();
})

describe("Test DistrictRepository", () => {

  test("save() - succeeds", async () => {
    await convoRepository.save(convo);
  });

  
  test("save() - Saving a convo with a prexisting id fails", async () => {
    await convoRepository.save(convo);
    await expect(convoRepository.save(convo)).rejects.toThrow(UniqueObjectAlreadyExistsError);
  });

  test("getById() - succeeds", async () => {
    await convoRepository.save(convo);
    await expect(convoRepository.getById(convo.id)).resolves.toEqual(convo);
  });
  
  test("getById() - Getting a nonexistant convo returns null", async () => {
    await convoRepository.save(convo);
    await expect(convoRepository.getById(convo.id + 'asd')).resolves.toBeNull();
  });

});

