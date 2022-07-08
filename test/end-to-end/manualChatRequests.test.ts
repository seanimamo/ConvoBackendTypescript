

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";
import { Convo, ConvoSource, ConvoStatus } from "../../common/objects/Convo";
import { District, DistrictId } from "../../common/objects/District";
import { ConvoPreference } from "../../common/objects/enums";
import { GeneralChatRequest } from "../../common/objects/talking-point-post/GeneralChatRequest";
import { TalkingPointPost } from "../../common/objects/talking-point-post/TalkingPointPost";
import { User } from "../../common/objects/user/User";
import { DistrictRepository } from "../../common/respositories/district/DistrictRepository";
import { ConvoRepository } from "../../common/respositories/convo/ConvoRepository";
import { GeneralChatRequestRepository } from "../../common/respositories/talking-point-post/GeneralChatRequestRepository";

import { TalkingPointPostRepository } from "../../common/respositories/talking-point-post/TalkingPointPostRepository";
import { UserRepository } from "../../common/respositories/user/UserRepository";
import { getDummyConvoProps, getDummyDistrict, getDummyDistrictProps, getDummyGeneralChatRequest, getDummyGeneralChatRequestProps, getDummyTalkingPointPost, getDummyTalkingPointPostProps, getDummyUser, getDummyUserProps } from "../util/DummyFactory";

let v3Client: DynamoDBClient;
let userRepository: UserRepository;
let talkingPointPostRepo: TalkingPointPostRepository;
let districtRepo: DistrictRepository;
let generalChatRequestRepo: GeneralChatRequestRepository;
let convoRepository: ConvoRepository;
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
  talkingPointPostRepo = new TalkingPointPostRepository(v3Client);
  districtRepo = new DistrictRepository(v3Client);
  generalChatRequestRepo = new GeneralChatRequestRepository(v3Client);
  convoRepository = new ConvoRepository(v3Client);
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
    // START ----------------------- Initial data creation -----------------------------
    const user1 = User.builder({
      ...getDummyUserProps(),
      userName: "user1",
      email: "user1@gmail.com"
    });
    await userRepository.save(user1);

    const user2 = User.builder({
      ...getDummyUserProps(),
      userName: "user2",
      email: "user2@gmail.com"
    });
    await userRepository.save(user2);

    const user3 = User.builder({
      ...getDummyUserProps(),
      userName: "user3",
      email: "user3@gmail.com"
    });
    await userRepository.save(user3);

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
      parentId: new DistrictId({title: districts[0].title}),
      createDate: new Date('2022-01-01'),
      metrics: {
        ...getDummyTalkingPointPostProps().metrics,
        absoluteScore: 1,
      }
    }));
    talkingPoints.push(TalkingPointPost.builder({
      ...getDummyTalkingPointPostProps(),
      parentId: new DistrictId({title: districts[0].title}),
      createDate: new Date('2022-01-02'),
      metrics: {
        ...getDummyTalkingPointPostProps().metrics,
        absoluteScore: 2
      }
    }));
    talkingPoints.push(TalkingPointPost.builder({
      ...getDummyTalkingPointPostProps(),
      parentId: new DistrictId({title: districts[0].title}),
      createDate: new Date('2022-01-03'),
      metrics: {
        ...getDummyTalkingPointPostProps().metrics,
        absoluteScore: 3
      }
    }));
    talkingPoints.push(TalkingPointPost.builder({
      ...getDummyTalkingPointPostProps(),
      parentId: new DistrictId({title: districts[1].title}),
      createDate: new Date('2022-01-04'),
    }));
    // purposely saved out of order to prove they return in order of absolute score
    await talkingPointPostRepo.save({ data: talkingPoints[0] });
    await talkingPointPostRepo.save({ data: talkingPoints[1] });
    await talkingPointPostRepo.save({ data: talkingPoints[3] });
    await talkingPointPostRepo.save({ data: talkingPoints[2] });

    // 3. create General Chat Requests
    // UI: Create General Chat Request page
    const user1CasualGenChatReq = GeneralChatRequest.builder({
      ...getDummyGeneralChatRequestProps(),
      parentId: talkingPoints[0].id,
      createDate: new Date('2022-01-01'),
      convoPreference: ConvoPreference.CASUAL,
      authorUserName: user1.userName
    });
    const user2DebateGenChatReq = GeneralChatRequest.builder({
      ...getDummyGeneralChatRequestProps(),
      parentId: talkingPoints[0].id,
      createDate: new Date('2022-01-02'),
      convoPreference: ConvoPreference.DEBATE,
      authorUserName: user2.userName
    });
    const user2TalkingPoint2CasualGenChatReq = GeneralChatRequest.builder({
      ...getDummyGeneralChatRequestProps(),
      parentId: talkingPoints[1].id,
      createDate: new Date('2022-01-01'),
      convoPreference: ConvoPreference.CASUAL,
      authorUserName: user2.userName
    });

    const user3CasualGenChatReq = GeneralChatRequest.builder({
      ...getDummyGeneralChatRequestProps(),
      parentId: talkingPoints[0].id,
      createDate: new Date('2022-01-01'),
      convoPreference: ConvoPreference.CASUAL,
      authorUserName: user3.userName
    });


    await generalChatRequestRepo.save({ data: user1CasualGenChatReq });
    await generalChatRequestRepo.save({ data: user2DebateGenChatReq });
    await generalChatRequestRepo.save({ data: user2TalkingPoint2CasualGenChatReq });
    await generalChatRequestRepo.save({ data: user3CasualGenChatReq });

    // END ---------------------- Initial data creation -----------------------------

    /**
     * 1. Retrieve districts
     * UI Location: List all districts page
     */
    const retrievedDistrictsDynamoResp = await districtRepo.listDistricts();
    expect(retrievedDistrictsDynamoResp.data).toBeDefined();
    expect(retrievedDistrictsDynamoResp.data.length).toEqual(3);
    expect(retrievedDistrictsDynamoResp.data).toContainEqual(districts[0]);
    expect(retrievedDistrictsDynamoResp.data).toContainEqual(districts[1]);
    expect(retrievedDistrictsDynamoResp.data).toContainEqual(districts[2]);

    /**
     * 2. Get talkingPoints under a district
     * UI Location: Single district page
     */
    const retrievedPostDynamoResp = await talkingPointPostRepo.getByDistrictTitle({ title: districts[0].title });
    const retrievedPosts = retrievedPostDynamoResp.data;
    expect(retrievedPosts.length).toEqual(3);
    // Confirm posts are sorted by absolute score
    expect(retrievedPosts[0]).toEqual(talkingPoints[2]);
    expect(retrievedPosts[1]).toEqual(talkingPoints[1]);
    expect(retrievedPosts[2]).toEqual(talkingPoints[0]);

    /**
    * 3. Get the single talking point you specified by id (Assume user selected retrievedPosts[0])
    * **This query may not be necessary in practice thanks to the previous query from step 4. But it's added here for completeness
    * UI Location: Single Talking Point Post Page
     */
    const retrievedTalkingPointById = await talkingPointPostRepo.getById(retrievedPosts[2].id) as TalkingPointPost;
    expect(retrievedTalkingPointById).toEqual(talkingPoints[0]);


    /**
     * 4. list general chat requests for the talking point
     * UI Location: Single Talking Point Post Page
     */
    const retrievedGeneralChatReqs = await generalChatRequestRepo.getByTalkingPointPost({ postId: retrievedTalkingPointById!.id });
    expect(retrievedGeneralChatReqs.data.length).toEqual(3);
    expect(retrievedGeneralChatReqs.data).toContainEqual(user1CasualGenChatReq);
    expect(retrievedGeneralChatReqs.data).toContainEqual(user2DebateGenChatReq);
    expect(retrievedGeneralChatReqs.data).toContainEqual(user3CasualGenChatReq);

    /**
     * 5. List only general chat requests the user is interested in based on convo preference
     * UI Location: Single Talking Point Post Page
     */
    const retrievedGeneralChatReqs2 = await generalChatRequestRepo.getByTalkingPointPost({
      postId: retrievedTalkingPointById!.id,
      convoPreference: ConvoPreference.CASUAL
    });
    expect(retrievedGeneralChatReqs2.data.length).toEqual(2);
    expect(retrievedGeneralChatReqs2.data).toContainEqual(user1CasualGenChatReq);
    expect(retrievedGeneralChatReqs2.data).toContainEqual(user3CasualGenChatReq);

    /**
     * 6. User 1 accepts a general chat request match with user 3, which in turn creates a partially accepted convo
     * Note: that in this step, a convo could outright be created with a status of PARTIALLY_ACCEPTED but for completeness sake,
     * there is an added step of user1 initially accepting the convo with a status of NOT_ACCEPTED
     * 
     * UI Location: Single Talking Point Post Page OR Convo User Dashboard (User 1's dashboard)
     */
    const convo = Convo.builder({
      ...getDummyConvoProps(),
      status: ConvoStatus.NOT_ACCEPTED,
      sourcedFrom: ConvoSource.GENERAL_CHAT_REQUEST,
      generalChatRequests: [user1CasualGenChatReq, user3CasualGenChatReq],
      participantUsernames: [user1.userName, user3.userName],
      acceptedUserNames: undefined
    })
    await convoRepository.save(convo);

    const partiallyAcceptedConvo = await convoRepository.acceptConvo(convo.id, user1.userName);
    expect(partiallyAcceptedConvo.acceptedUserNames).toBeDefined();
    expect(partiallyAcceptedConvo.acceptedUserNames).toHaveLength(1);
    expect(partiallyAcceptedConvo.acceptedUserNames).toContainEqual(user1.userName);
    expect(partiallyAcceptedConvo.status).toStrictEqual(ConvoStatus.PARTIALLY_ACCEPTED);

    /**
     * 7. User 1 can see all their convo's, including the one they just created
     * UI Location: Convo User Dashboard (User 1's dashboard)
     */
    const retrievedConvosByUser1Username = await convoRepository.getByAuthorUsername({ username: user1.userName });
    expect(retrievedConvosByUser1Username!.data.length).toEqual(1);
    expect(retrievedConvosByUser1Username!.data[0] as Convo).toEqual(partiallyAcceptedConvo);

    /**
     * 8. User 2 CANNOT see any convo's, since there are none that were partially/fully accepted and included them
     * UI Location: Convo User Dashboard (User 2's dashboard)
     */
    const retrievedConvosByUser2Username = await convoRepository.getByAuthorUsername({ username: user2.userName });
    expect(retrievedConvosByUser2Username!.data).toHaveLength(0);

    /**
     * 9. User 3 can see all their convo's, including the partially accepted one created by user 1
     * UI Location: Convo User Dashboard (User 3's dashboard)
     */
    const retrievedConvosByUser3Username = await convoRepository.getByAuthorUsername({ username: user3.userName });
    expect(retrievedConvosByUser3Username!.data.length).toEqual(1);
    expect(retrievedConvosByUser3Username!.data[0] as Convo).toEqual(partiallyAcceptedConvo);

    /**
     * 10. User 3 can either accept or reject the convo, in this case they accept the convo.
     * UI Location: Convo User Dashboard (User 3's dashboard)
     */
    const acceptedConvo = await convoRepository.acceptConvo(partiallyAcceptedConvo.id, user3.userName);
    expect(acceptedConvo.acceptedUserNames).toBeDefined();
    expect(acceptedConvo.acceptedUserNames).toHaveLength(2);
    expect(acceptedConvo.acceptedUserNames).toContainEqual(user1.userName);
    expect(acceptedConvo.acceptedUserNames).toContainEqual(user3.userName);
    expect(acceptedConvo.status).toStrictEqual(ConvoStatus.ACCEPTED);

    /**
     * 11. User 1 decides to reject the convo after it had been accepted by all parties
     * 
     * UI Location: Convo User Dashboard (User 1's dashboard)
     */
     const rejectedConvo = await convoRepository.rejectConvo(acceptedConvo.id, user1.userName);
     expect(rejectedConvo.rejectedUserNames).toBeDefined();
     expect(rejectedConvo.rejectedUserNames).toHaveLength(1);
     expect(rejectedConvo.rejectedUserNames).toContainEqual(user1.userName);
     expect(rejectedConvo.status).toStrictEqual(ConvoStatus.CANCELED);
  });

});
