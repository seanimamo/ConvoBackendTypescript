import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";
import { getDummyDistrict, getDummyGeneralChatRequest, getDummyTalkingPointPost } from "../../../util/DummyFactory";
import { District } from "../../../../common/objects/District";
import { ParentObjectDoesNotExistError, UniqueObjectAlreadyExistsError } from "../../../../common/respositories/error";
import { TalkingPointPost } from "../../../../common/objects/talking-point-post/TalkingPointPost";
import { TalkingPointPostRepository } from "../../../../common/respositories/talking-point-post/TalkingPointPostRepository";
import { DistrictRepository } from "../../../../common/respositories/district/DistrictRepository";
import { GeneralChatRequestRepository } from "../../../../common/respositories/talking-point-post/GeneralChatRequestRepository";
import { GeneralChatRequest } from "../../../../common/objects/talking-point-post/GeneralChatRequest";

let v3Client: DynamoDBClient;
let talkingPointRepo: TalkingPointPostRepository;
let districtRepo: DistrictRepository;
let chatRequestRepo: GeneralChatRequestRepository;
let talkingPoint: TalkingPointPost;
let district: District;
let chatRequest: GeneralChatRequest;
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
  chatRequestRepo = new GeneralChatRequestRepository(v3Client);
});

beforeEach(async () => {
  await createTables();
  talkingPoint = getDummyTalkingPointPost();
  district = getDummyDistrict();
  chatRequest = getDummyGeneralChatRequest();
})

afterEach(async () => {
  await deleteTables();
})

afterAll(async () => {
  v3Client.destroy();
  stopDb();
})

describe("Test DistrictRepository", () => {

  test("Saving new GeneralChatRequest succeeds when not checking for parent and the parent does not exist", async () => {
    await chatRequestRepo.save({ data: chatRequest, checkParentExistence: false });
  });

  test("Saving new GeneralChatRequest succeeds when not checking for parent and the parent exists", async () => {
    await districtRepo.save(district);
    await talkingPointRepo.save({ data: talkingPoint });
    await chatRequestRepo.save({ data: chatRequest, checkParentExistence: false });
  });

  test("Saving new GeneralChatRequest succeeds when checking for parent and the parent exists", async () => {
    await districtRepo.save(district);
    await talkingPointRepo.save({ data: talkingPoint });
    await chatRequestRepo.save({ data: chatRequest });
  });

  test("Saving new GeneralChatRequest fails when checking for parent and the parent doesnt exist", async () => {
    await expect(chatRequestRepo.save({ data: chatRequest })).rejects.toThrow(ParentObjectDoesNotExistError);
  });

  test("Saving new GeneralChatRequest fails when another talking point with the same id already exists", async () => {
    await districtRepo.save(district);
    await talkingPointRepo.save({ data: talkingPoint });
    await chatRequestRepo.save({ data: chatRequest });
    await expect(chatRequestRepo.save({ data: chatRequest })).rejects.toThrow(UniqueObjectAlreadyExistsError);
  });

  test("Retrieve a single GeneralChatRequest by its unique id succeeds", async () => {
    await districtRepo.save(district);
    await talkingPointRepo.save({ data: talkingPoint });
    await chatRequestRepo.save({ data: chatRequest });
    const retrievedPost = await talkingPointRepo.getById(talkingPoint.id);
    expect(retrievedPost).toEqual(talkingPoint);
  });

  test("Retrieve multiple taking points by district title succeeds and only gets posts under the given district title",
    async () => {
      await districtRepo.save(district);
      const talkingPoint1 = getDummyTalkingPointPost();
      const talkingPoint2 = getDummyTalkingPointPost();
      talkingPoint2.id = "aDifftalkingPointId";
      await talkingPointRepo.save({ data: talkingPoint1 });
      await talkingPointRepo.save({ data: talkingPoint2 });

      const chatRequest1 = getDummyGeneralChatRequest();
      const chatRequest2 = getDummyGeneralChatRequest();
      chatRequest2.id = "634636738";
      const chatRequest3 = getDummyGeneralChatRequest();
      chatRequest3.id = "2357034622";
      const chatRequest4 = getDummyGeneralChatRequest();
      chatRequest4.id = "1248590543";
      chatRequest4.parentId = talkingPoint2.id
      await chatRequestRepo.save({ data: chatRequest1 });
      await chatRequestRepo.save({ data: chatRequest2 });
      await chatRequestRepo.save({ data: chatRequest3 });
      await chatRequestRepo.save({ data: chatRequest4 });

      const retrievedDistrict1Posts = await chatRequestRepo.getByTalkingPointPost({
        postId: talkingPoint1.id
      });

      expect(retrievedDistrict1Posts.data).toContainEqual(chatRequest1);
      expect(retrievedDistrict1Posts.data).toContainEqual(chatRequest2);
      expect(retrievedDistrict1Posts.data).toContainEqual(chatRequest3);
      expect(retrievedDistrict1Posts.data).not.toContainEqual(chatRequest4);
    });

  test("Retrieve multiple taking points by author username succeeds and only gets posts under the given author username",
    async () => {
      await districtRepo.save(district);
      await talkingPointRepo.save({ data: talkingPoint });
      const chatRequest1 = getDummyGeneralChatRequest();
      const chatRequest2 = getDummyGeneralChatRequest();
      chatRequest2.id = "634636738";
      const chatRequest3 = getDummyGeneralChatRequest();
      chatRequest3.id = "2357034622";
      const chatRequest4 = getDummyGeneralChatRequest();
      chatRequest4.id = "1248590543";
      chatRequest4.authorUserName = "someOtherUsrename11";
      await chatRequestRepo.save({ data: chatRequest1 });
      await chatRequestRepo.save({ data: chatRequest2 });
      await chatRequestRepo.save({ data: chatRequest3 });
      await chatRequestRepo.save({ data: chatRequest4 });

      const retrievedDistrict1Posts = await chatRequestRepo.getByAuthorUsername({
        username: chatRequest1.authorUserName
      });

      expect(retrievedDistrict1Posts.data).toContainEqual(chatRequest1);
      expect(retrievedDistrict1Posts.data).toContainEqual(chatRequest2);
      expect(retrievedDistrict1Posts.data).toContainEqual(chatRequest3);
      expect(retrievedDistrict1Posts.data).not.toContainEqual(chatRequest4);
    });
});