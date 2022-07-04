import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";
import { getDummyDistrict, getDummyGeneralChatRequest, getDummyGeneralChatRequestProps, getDummyTalkingPointPost, getDummyTalkingPointPostProps } from "../../../util/DummyFactory";
import { District } from "../../../../common/objects/District";
import { ParentObjectDoesNotExistError, UniqueObjectAlreadyExistsError } from "../../../../common/respositories/error";
import { TalkingPointPost } from "../../../../common/objects/talking-point-post/TalkingPointPost";
import { TalkingPointPostRepository } from "../../../../common/respositories/talking-point-post/TalkingPointPostRepository";
import { DistrictRepository } from "../../../../common/respositories/district/DistrictRepository";
import { GeneralChatRequestRepository } from "../../../../common/respositories/talking-point-post/GeneralChatRequestRepository";
import { GeneralChatRequest } from "../../../../common/objects/talking-point-post/GeneralChatRequest";
import { ConvoPreference } from "../../../../common/objects/enums";

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

describe("GeneralChatRequestRepository", () => {

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

  test("getByTalkingPointPost - Retrieve multiple taking points by district title succeeds and only gets posts under the given district title",
    async () => {
      await districtRepo.save(district);
      const talkingPoint1 = getDummyTalkingPointPost();
      const talkingPoint2 = TalkingPointPost.builder({
        ...getDummyTalkingPointPostProps(),
        createDate: new Date(talkingPoint1.createDate.getDate() + 1),
      });
      await talkingPointRepo.save({ data: talkingPoint1 });
      await talkingPointRepo.save({ data: talkingPoint2 });
      // create date is used in the id of the request so changing it creates a unique id.
      const chatRequest1 = GeneralChatRequest.builder({
        ...getDummyGeneralChatRequestProps(),
        createDate: new Date('2022-01-01')
      });
      const chatRequest2 = GeneralChatRequest.builder({
        ...getDummyGeneralChatRequestProps(),
        createDate: new Date('2022-01-02')
      });
      const chatRequest3 = GeneralChatRequest.builder({
        ...getDummyGeneralChatRequestProps(),
        createDate: new Date('2022-01-03')
      });
      const chatRequest4 = GeneralChatRequest.builder({
        ...getDummyGeneralChatRequestProps(),
        createDate: new Date('2022-01-04'),
        parentId: talkingPoint2.id
      });
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

  test("getByTalkingPointPost - Retrieve multiple taking points by author username succeeds and only gets posts under the given author username",
    async () => {
      await districtRepo.save(district);
      await talkingPointRepo.save({ data: talkingPoint });
      // create date is used in the id of the request so changing it creates a unique id.
      const chatRequest1 = GeneralChatRequest.builder({
        ...getDummyGeneralChatRequestProps(),
        createDate: new Date('2022-01-01')
      });
      const chatRequest2 = GeneralChatRequest.builder({
        ...getDummyGeneralChatRequestProps(),
        createDate: new Date('2022-01-02')
      });
      const chatRequest3 = GeneralChatRequest.builder({
        ...getDummyGeneralChatRequestProps(),
        createDate: new Date('2022-01-03')
      });
      const chatRequest4 = GeneralChatRequest.builder({
        ...getDummyGeneralChatRequestProps(),
        createDate: new Date('2022-01-04'),
        authorUserName: "someOtherUsername11"
      });
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

  test("getByTalkingPointPost() - filters by convo preference",
    async () => {
      await districtRepo.save(district);
      await talkingPointRepo.save({ data: talkingPoint });
      // create date is used in the id of the request so changing it creates a unique id.
      const chatRequest1 = GeneralChatRequest.builder({
        ...getDummyGeneralChatRequestProps(),
        createDate: new Date('2022-01-01'),
        parentId: talkingPoint.id,
        convoPreference: ConvoPreference.CASUAL
      });
      const chatRequest2 = GeneralChatRequest.builder({
        ...getDummyGeneralChatRequestProps(),
        createDate: new Date('2022-01-02'),
        parentId: talkingPoint.id,
        convoPreference: ConvoPreference.CASUAL
      });
      const chatRequest3 = GeneralChatRequest.builder({
        ...getDummyGeneralChatRequestProps(),
        createDate: new Date('2022-01-03'),
        parentId: talkingPoint.id,
        convoPreference: ConvoPreference.DEBATE
      });
      const chatRequest4 = GeneralChatRequest.builder({
        ...getDummyGeneralChatRequestProps(),
        createDate: new Date('2022-01-04'),
                parentId: talkingPoint.id,
        convoPreference: ConvoPreference.NONE
      });
      await chatRequestRepo.save({ data: chatRequest1 });
      await chatRequestRepo.save({ data: chatRequest2 });
      await chatRequestRepo.save({ data: chatRequest3 });
      await chatRequestRepo.save({ data: chatRequest4 });


      // 7. list only general chat requests the user is interested in based on convo preference
      const retrievedGeneralChatReqs1 = await chatRequestRepo.getByTalkingPointPost({
        postId: talkingPoint.id,
        convoPreference: ConvoPreference.CASUAL
      });
      expect(retrievedGeneralChatReqs1.data.length).toEqual(2);
      expect(retrievedGeneralChatReqs1.data).toContainEqual(chatRequest1);
      expect(retrievedGeneralChatReqs1.data).toContainEqual(chatRequest2);

      const retrievedGeneralChatReqs2 = await chatRequestRepo.getByTalkingPointPost({
        postId: talkingPoint.id,
        convoPreference: ConvoPreference.DEBATE
      });
      expect(retrievedGeneralChatReqs2.data.length).toEqual(1);
      expect(retrievedGeneralChatReqs2.data).toContainEqual(chatRequest3);

      const retrievedGeneralChatReqs3 = await chatRequestRepo.getByTalkingPointPost({
        postId: talkingPoint.id,
        convoPreference: ConvoPreference.NONE
      });
      expect(retrievedGeneralChatReqs3.data.length).toEqual(1);
      expect(retrievedGeneralChatReqs3.data).toContainEqual(chatRequest4);
    });

    test("getByAuthorUsername() - returns empty list when no results found", async () => {
      await chatRequestRepo.save({ data: chatRequest, checkParentExistence: false });
      const response = await chatRequestRepo.getByAuthorUsername({ username: "userWithNoChatReqs" });
      expect(response.data).toHaveLength(0);
    })

});