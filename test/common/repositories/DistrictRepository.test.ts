
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";
import { getDummyDistrict, getDummyDistrictProps } from "../../util/DummyFactory";
import { District } from "../../../common/objects/District";
import { DistrictRepository } from "../../../common/respositories/district/DistrictRepository";
import { UniqueObjectAlreadyExistsError } from "../../../common/respositories/error";

let v3Client: DynamoDBClient;
let districtRepository: DistrictRepository;
let district: District;

beforeAll(async () => {
  await startDb();

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
  await v3Client.destroy();
  await stopDb();
})

describe("DistrictRepository", () => {

  test("save() - Saving new district succeeds", async () => {
    await districtRepository.save(district);
  });

  test("save() - Saving a district with a prexisting title fails", async () => {
    await districtRepository.save(district);
    await expect(districtRepository.save(district)).rejects.toThrow(UniqueObjectAlreadyExistsError);
  });

  test("getByTitle() - Getting an existing district by title succeeds", async () => {
    await districtRepository.save(district);
    const district2 = getDummyDistrict();
    district2.title = "ADifferentTittle";
    await expect(districtRepository.getByTitle(district.title)).resolves.toEqual(district);
  });

  test("getByTitle() - Getting a nonexistant district returns null", async () => {
    await districtRepository.save(district);
    await expect(districtRepository.getByTitle(district.title+ 'asd')).resolves.toBeNull();
  });


  test("getAll", async () => {
    await districtRepository.save(district);
    await districtRepository.save(
      District.builder({
        ...getDummyDistrictProps(),
        title: "theSecondDistrict"
      })
    );
    await districtRepository.save(
      District.builder({
        ...getDummyDistrictProps(),
        title: "theThirdDistrict"
      })
    );
    const districts = await districtRepository.listDistricts();
    expect(districts.data).toBeDefined();
    expect(districts.data.length).toEqual(3);
  });

});

