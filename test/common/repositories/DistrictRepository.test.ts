
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";
import { getDummyDistrict } from "../../util/DummyFactory";
import { District } from "../../../common/objects/district/District";
import { DistrictRepository } from "../../../common/respositories/district/DistrictRepository";
import { DistrictAlreadyExists } from "../../../common/respositories/district/error";

let v3Client: DynamoDBClient;
let districtRepository: DistrictRepository;
let district: District;
jest.setTimeout(10000);

beforeAll(async () => {
  await startDb();
  console.log("process.env.MOCK_DYNAMODB_ENDPOINT: ", process.env.MOCK_DYNAMODB_ENDPOINT)

  v3Client = new DynamoDBClient({
    region: "us-east-1",
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT
  });
  districtRepository = new DistrictRepository(v3Client);
});

beforeEach(async () => {
  await createTables();
  district = getDummyDistrict();
})

afterEach(async () => {
  await deleteTables();
})

afterAll(async () => {
  v3Client.destroy();
  stopDb();
})

describe("Test DistrictRepository", () => {

  test("Saving new district succeeds", async () => {
    await districtRepository.save(district);
  });

  test("Getting an existing district by title succeeds", async () => {
    await districtRepository.save(district);
    await expect(districtRepository.getByTitle(district.title)).resolves.toEqual(district);
  });
  
  test("Getting a nonexistant district returns null", async () => {
    await districtRepository.save(district);
    await expect(districtRepository.getByTitle(district.title+ 'asd')).resolves.toBeNull();
  });

  test("Saving a district with a prexisting title fails", async () => {
    await districtRepository.save(district);
    await expect(districtRepository.save(district)).rejects.toThrow(DistrictAlreadyExists);
  });

});

