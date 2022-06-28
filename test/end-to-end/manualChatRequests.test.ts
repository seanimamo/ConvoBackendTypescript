

import { DynamoDBClient, QueryCommand, QueryCommandInput, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";
import { District } from "../../common/objects/District";
import { TalkingPointPost } from "../../common/objects/talking-point-post/TalkingPointPost";
import { User } from "../../common/objects/user/User";
import { DistrictRepository } from "../../common/respositories/district/DistrictRepository";
import { DYNAMODB_INDEXES } from "../../common/respositories/DynamoDBConstants";

import { TalkingPointPostRepository } from "../../common/respositories/talking-point-post/TalkingPointPostRepository";
import { UserRepository } from "../../common/respositories/user/UserRepository";
import { getDummyDistrict, getDummyDistrictProps, getDummyTalkingPointPost, getDummyTalkingPointPostProps, getDummyUser } from "../util/DummyFactory";

let v3Client: DynamoDBClient;
let userRepository: UserRepository;
let talkingPointPostRepo: TalkingPointPostRepository;
let districtRepo: DistrictRepository;
let user: User;
jest.setTimeout(1000000);

beforeAll(async () => {
  await startDb();
  console.log("process.env.MOCK_DYNAMODB_ENDPOINT: ", process.env.MOCK_DYNAMODB_ENDPOINT)

  v3Client = new DynamoDBClient({
    region: "us-east-1",
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT
  });
  userRepository = new UserRepository(v3Client);
  talkingPointPostRepo = new TalkingPointPostRepository(v3Client)
  districtRepo = new DistrictRepository(v3Client)
});

beforeEach(async () => {
  await createTables();
  user = getDummyUser();
})

afterEach(async () => {
  await deleteTables();
})

afterAll(async () => {
  v3Client.destroy();
  stopDb();
})

describe("mock End To End", () => {


  test("end to end manual chat request creation, basic user experience", async () => {
    // 1. create districts
    // UI: Create District page
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
    await districtRepo.save(districts[0]);
    await districtRepo.save(districts[1]);
    await districtRepo.save(districts[2]);

    // 2. create talking point posts
    // UI: Create talkingPoint page
    const talkingPoints = [];
    talkingPoints.push(TalkingPointPost.builder({
      ...getDummyTalkingPointPostProps(),
      parentId: districts[0].title,
      metrics: {
        ...getDummyTalkingPointPostProps().metrics,
        absoluteScore: 1,
      }
    }));
    talkingPoints.push(TalkingPointPost.builder({
      ...getDummyTalkingPointPostProps(),
      parentId: districts[0].title,
      createDate: new Date(talkingPoints[0].createDate.getDate() - 1),
      metrics: {
        ...getDummyTalkingPointPostProps().metrics,
        absoluteScore: 2
      }
    }));
    talkingPoints.push(TalkingPointPost.builder({
      ...getDummyTalkingPointPostProps(),
      parentId: districts[0].title,
      createDate: new Date(talkingPoints[0].createDate.getDate() - 2),
      metrics: {
        ...getDummyTalkingPointPostProps().metrics,
        absoluteScore: 3
      }
    }));
    talkingPoints.push(TalkingPointPost.builder({
      ...getDummyTalkingPointPostProps(),
      parentId: districts[1].title
    }));

    // purposely saved out of order to prove they return in order of absolute score
    await talkingPointPostRepo.save({ data: talkingPoints[0] });
    await talkingPointPostRepo.save({ data: talkingPoints[1] });
    await talkingPointPostRepo.save({ data: talkingPoints[3] });
    await talkingPointPostRepo.save({ data: talkingPoints[2] });

    // 3. Retrieve districts
    // UI: List all districts page
    const retrievedDistrictsDynamoResp = await districtRepo.listDistricts();
    expect(retrievedDistrictsDynamoResp.data).toBeDefined();
    expect(retrievedDistrictsDynamoResp.data.length).toEqual(3);
    expect(retrievedDistrictsDynamoResp.data).toContainEqual(districts[0]);
    expect(retrievedDistrictsDynamoResp.data).toContainEqual(districts[1]);
    expect(retrievedDistrictsDynamoResp.data).toContainEqual(districts[2]);

    // 4. Get talkingPoints under a district
    // UI: Single district page
    const retrievedPostDynamoResp = await talkingPointPostRepo.getByDistrictTitle({ title: districts[0].title });
    const retrievedPosts = retrievedPostDynamoResp.data;
    expect(retrievedPosts.length).toEqual(3);
    // Confirm posts are sorted by absolute score
    expect(retrievedPosts[0]).toEqual(talkingPoints[2]);
    expect(retrievedPosts[1]).toEqual(talkingPoints[1]);
    expect(retrievedPosts[2]).toEqual(talkingPoints[0]);

    // 5. Get the single talking point you specified by id
    // Note: This query may not be necessary in practice thanks to the previous query from step 4. But it's added here for completeness

    // 6. list general chat requests for the talking point

    // 7. list only general chat requests the user is interested in based on convo preference

    // 8. user 1 accepts a general chat request match with user 2, which in turn creates a partially accepted convo

    // 9. user 1 can see all their convo's, including the one they just created

    // 10. user 2 can see all their convo's, including the partially accepted one created by user 1

    // 11. user 2 can either accept or reject the convo

  });

});
