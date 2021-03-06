
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";
import { getDummyDistrict, getDummyDistrictProps, getDummyTalkingPointPost, getDummyTalkingPointPostProps } from "../../../util/DummyFactory";
import { District, DistrictId } from "../../../../common/objects/District";
import { ParentObjectDoesNotExistError, UniqueObjectAlreadyExistsError } from "../../../../common/respositories/error";
import { TalkingPointPost } from "../../../../common/objects/talking-point-post/TalkingPointPost";
import { TalkingPointPostRepository, TalkingPointPostRepositoryGsiSortKey } from "../../../../common/respositories/talking-point-post/TalkingPointPostRepository";
import { DistrictRepository } from "../../../../common/respositories/district/DistrictRepository";

let v3Client: DynamoDBClient;
let talkingPointRepo: TalkingPointPostRepository;
let districtRepo: DistrictRepository;
let talkingPoint: TalkingPointPost;
let district: District;

beforeAll(async () => {
  await startDb();

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
  await v3Client.destroy();
  await stopDb();
})

describe("TalkingPointPostRepository", () => {

  test("save() - Saving new talkingPoint succeeds when not checking for parent and the parent doesnt exist", async () => {
    await talkingPointRepo.save({ data: talkingPoint, checkParentExistence: false });
  });

  test("save() - Saving new talkingPoint succeeds when not checking for parent and the parent exists", async () => {
    await districtRepo.save(district);
    await talkingPointRepo.save({ data: talkingPoint, checkParentExistence: false });
  });

  test("save() - Saving new talkingPoint succeeds when checking for parent and the parent exists", async () => {
    await districtRepo.save(district);
    await talkingPointRepo.save({ data: talkingPoint });
  });

  test("save() - Saving new talkingPoint fails when checking for parent and the parent doesnt exist", async () => {
    await expect(talkingPointRepo.save({ data: talkingPoint })).rejects.toThrow(ParentObjectDoesNotExistError);
  });

  test("save() - Saving new talkingPoint fails when another talking point with the same id already exists", async () => {
    await districtRepo.save(district);
    await talkingPointRepo.save({ data: talkingPoint });
    await expect(talkingPointRepo.save({ data: talkingPoint })).rejects.toThrow(UniqueObjectAlreadyExistsError);
  });

  test("getById() - Retrieve a single Talking Point Post by its unique id succeeds", async () => {
    await districtRepo.save(district);
    await talkingPointRepo.save({ data: talkingPoint });
    await expect(talkingPointRepo.getById(talkingPoint.id)).resolves.toEqual(talkingPoint);
  });

  test("getByDistrictTitle() - Retrieve multiple taking points by district title succeeds,  only gets posts under the given district title sorts correctly.",
    async () => {
      // 1. create districts
      const districts = [];
      districts.push(getDummyDistrict());
      districts.push(District.builder({
        ...getDummyDistrictProps(),
        title: "TheSecondDistrict"
      }));
      districts.push(District.builder({
        ...getDummyDistrictProps(),
        title: "TheThirdDistrict"
      }));
      await Promise.all([districtRepo.save(districts[0]),
      districtRepo.save(districts[1]),
      districtRepo.save(districts[2])
      ]);

      // 2. create talking point posts
      const talkingPoints = [];
      talkingPoints.push(TalkingPointPost.builder({
        ...getDummyTalkingPointPostProps(),
        parentId: new DistrictId({ title: districts[0].title }),
        metrics: {
          ...getDummyTalkingPointPostProps().metrics,
          absoluteScore: 1,
          timeBasedScore: 4
        }
      }));
      talkingPoints.push(TalkingPointPost.builder({
        ...getDummyTalkingPointPostProps(),
        parentId: new DistrictId({ title: districts[0].title }),
        createDate: new Date(talkingPoints[0].createDate.getDate() - 1),
        metrics: {
          ...getDummyTalkingPointPostProps().metrics,
          absoluteScore: 2,
          timeBasedScore: 5
        }
      }));
      talkingPoints.push(TalkingPointPost.builder({
        ...getDummyTalkingPointPostProps(),
        parentId: new DistrictId({ title: districts[0].title }),
        createDate: new Date(talkingPoints[0].createDate.getDate() - 2),
        metrics: {
          ...getDummyTalkingPointPostProps().metrics,
          absoluteScore: 3,
          timeBasedScore: 3
        }
      }));
      talkingPoints.push(TalkingPointPost.builder({
        ...getDummyTalkingPointPostProps(),
        createDate: new Date(talkingPoints[0].createDate.getDate() - 3),
        parentId: new DistrictId({ title: districts[1].title })
      }));

      // purposely saved out of order to prove they return in order of absolute score
      await Promise.all([
        talkingPointRepo.save({ data: talkingPoints[0] }),
        talkingPointRepo.save({ data: talkingPoints[1] }),
        talkingPointRepo.save({ data: talkingPoints[3] }),
        talkingPointRepo.save({ data: talkingPoints[2] })
      ]);

      // 3. Retrieve districts
      const retrievedDistrictsDynamoResp = await districtRepo.listDistricts();
      expect(retrievedDistrictsDynamoResp.data).toBeDefined();
      expect(retrievedDistrictsDynamoResp.data.length).toEqual(3);

      // 4. get talkingPoints under a district sorted by absolute score
      const retrievedPostDynamoResp1 = await talkingPointRepo.getByDistrictTitle({ title: districts[0].title, sortBy: 'AbsoluteScore' });
      expect(retrievedPostDynamoResp1.data.length).toEqual(3);
      // Confirm posts are sorted by absolute score
      expect(retrievedPostDynamoResp1.data[0]).toEqual(talkingPoints[2]);
      expect(retrievedPostDynamoResp1.data[1]).toEqual(talkingPoints[1]);
      expect(retrievedPostDynamoResp1.data[2]).toEqual(talkingPoints[0]);

      // 5. get talkingPoints under a district sorted by time based score
      const retrievedPostDynamoResp2 = await talkingPointRepo.getByDistrictTitle({ title: districts[0].title, sortBy: 'TimeBased' });
      expect(retrievedPostDynamoResp2.data.length).toEqual(3);
      // Confirm posts are sorted by  time based score
      expect(retrievedPostDynamoResp2.data[0]).toEqual(talkingPoints[1]);
      expect(retrievedPostDynamoResp2.data[1]).toEqual(talkingPoints[0]);
      expect(retrievedPostDynamoResp2.data[2]).toEqual(talkingPoints[2]);
    });

  test("getByAuthorUsername() - Retrieve multiple taking points by author username succeeds, only gets posts under the given author username, sorts by newest create date",
    async () => {
      await districtRepo.save(district);
      const posts: TalkingPointPost[] = [];
      posts.push(TalkingPointPost.builder({
        ...getDummyTalkingPointPostProps(),
        createDate: new Date('2022-01-01'),
        metrics: {
          ...getDummyTalkingPointPostProps().metrics,
          absoluteScore: 1
        }
      }));
      // Note that changing the createDate changes the uuid of the post.
      posts.push(TalkingPointPost.builder({
        ...getDummyTalkingPointPostProps(),
        createDate: new Date('2022-01-03'),
        metrics: {
          ...getDummyTalkingPointPostProps().metrics,
          absoluteScore: 2
        }
      }));
      posts.push(TalkingPointPost.builder({
        ...getDummyTalkingPointPostProps(),
        createDate: new Date('2022-01-02'),
        metrics: {
          ...getDummyTalkingPointPostProps().metrics,
          absoluteScore: 3
        }
      }));
      posts.push(TalkingPointPost.builder({
        ...getDummyTalkingPointPostProps(),
        authorUserName: "someOtherduede1231",
      }));
      await Promise.all([
        talkingPointRepo.save({ data: posts[0] }),
        talkingPointRepo.save({ data: posts[1] }),
        talkingPointRepo.save({ data: posts[2] }),
        talkingPointRepo.save({ data: posts[3] })
      ]);

      const retrievedDistrict1Posts = await talkingPointRepo.getByAuthorUsername({
        username: posts[0].authorUserName
      });

      // Confirm posts are sorted by newest create date score
      expect(retrievedDistrict1Posts.data[0]).toEqual(posts[1]);
      expect(retrievedDistrict1Posts.data[1]).toEqual(posts[2]);
      expect(retrievedDistrict1Posts.data[2]).toEqual(posts[0]);
    });

});