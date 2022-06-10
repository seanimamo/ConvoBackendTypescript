
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";
import { getDummyDistrict, getDummyTalkingPointPost } from "../../../util/DummyFactory";
import { District } from "../../../../common/objects/District";
import { ParentObjectDoesNotExistError, UniqueObjectAlreadyExistsError } from "../../../../common/respositories/error";
import { TalkingPointPost } from "../../../../common/objects/talking-point-post/TalkingPointPost";
import { TalkingPointPostRepository } from "../../../../common/respositories/talking-point-post/TalkingPointPostRepository";
import { DistrictRepository } from "../../../../common/respositories/district/DistrictRepository";

let v3Client: DynamoDBClient;
let talkingPointRepo: TalkingPointPostRepository;
let districtRepo: DistrictRepository;
let talkingPoint: TalkingPointPost;
let district: District;
jest.setTimeout(10000);

beforeAll(async () => {
  await startDb();
  console.log("process.env.MOCK_DYNAMODB_ENDPOINT: ", process.env.MOCK_DYNAMODB_ENDPOINT)

  v3Client = new DynamoDBClient({
    region: "us-east-1",
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT
  });
  talkingPointRepo = new TalkingPointPostRepository(v3Client);
  districtRepo = new DistrictRepository(v3Client);
});

beforeEach(async () => {
  await createTables();
  talkingPoint = getDummyTalkingPointPost();
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

  test("Saving new talkingPoint succeeds when not checking for parent and the parent doesnt exist", async () => {
    await talkingPointRepo.save({ data: talkingPoint, checkParentExistence: false });
  });

  test("Saving new talkingPoint succeeds when not checking for parent and the parent exists", async () => {
    await districtRepo.save(district);
    await talkingPointRepo.save({ data: talkingPoint, checkParentExistence: false });
  });

  test("Saving new talkingPoint succeeds when checking for parent and the parent exists", async () => {
    await districtRepo.save(district);
    await talkingPointRepo.save({ data: talkingPoint });
  });

  test("Saving new talkingPoint fails when checking for parent and the parent doesnt exist", async () => {
    await expect(talkingPointRepo.save({ data: talkingPoint })).rejects.toThrow(ParentObjectDoesNotExistError);
  });

  test("Saving new talkingPoint fails when another talking point with the same id already exists", async () => {
    await districtRepo.save(district);
    await talkingPointRepo.save({ data: talkingPoint });
    await expect(talkingPointRepo.save({ data: talkingPoint })).rejects.toThrow(UniqueObjectAlreadyExistsError);
  });

  test("Retrieve a single Talking Point Post by its unique id succeeds", async () => {
    await districtRepo.save(district);
    await talkingPointRepo.save({ data: talkingPoint });
    const retrievedPost = await talkingPointRepo.getById(talkingPoint.id);
    expect(retrievedPost).toEqual(talkingPoint);
  });

  test("Retrieve multiple taking points by district title succeeds and only gets posts under the given district title",
    async () => {
      const district1 = getDummyDistrict();
      const district2 = getDummyDistrict();
      district2.title = "theSecondDistrict";
      await districtRepo.save(district1);
      await districtRepo.save(district2);
      const post1 = getDummyTalkingPointPost();
      const post2 = getDummyTalkingPointPost();
      post2.id = "634636738";
      const post3 = getDummyTalkingPointPost();
      post3.id = "2357034622";
      const post4 = getDummyTalkingPointPost();
      post4.id = "1248590543";
      post4.parentId = district2.title
      await talkingPointRepo.save({ data: post1 });
      await talkingPointRepo.save({ data: post2 });
      await talkingPointRepo.save({ data: post3 });
      await talkingPointRepo.save({ data: post4 });

      const retrievedDistrict1Posts = await talkingPointRepo.getByDistrictTitle({
        title: district1.title
      });

      expect(retrievedDistrict1Posts.data).toContainEqual(post1);
      expect(retrievedDistrict1Posts.data).toContainEqual(post2);
      expect(retrievedDistrict1Posts.data).toContainEqual(post3);
      expect(retrievedDistrict1Posts.data).not.toContainEqual(post4);
    });

  test("Retrieve multiple taking points by author username succeeds and only gets posts under the given author username",
    async () => {
      await districtRepo.save(district);
      const post1 = getDummyTalkingPointPost();
      post1.absoluteScore = 1;
      const post2 = getDummyTalkingPointPost();
      post2.id = "634636738";
      post2.absoluteScore = 2;
      const post3 = getDummyTalkingPointPost();
      post3.id = "2357034622";
      post3.absoluteScore = 3;
      const post4 = getDummyTalkingPointPost();
      post4.id = "1248590543";
      post4.authorUserName = "someOtherduede1231";
      await talkingPointRepo.save({ data: post1 });
      await talkingPointRepo.save({ data: post2 });
      await talkingPointRepo.save({ data: post3 });
      await talkingPointRepo.save({ data: post4 });

      const retrievedDistrict1Posts = await talkingPointRepo.getByAuthorUsername({
        username: post1.authorUserName
      });

      expect(retrievedDistrict1Posts.data).toContainEqual(post1);
      expect(retrievedDistrict1Posts.data).toContainEqual(post2);
      expect(retrievedDistrict1Posts.data).toContainEqual(post3);
      expect(retrievedDistrict1Posts.data).not.toContainEqual(post4);
    });

});