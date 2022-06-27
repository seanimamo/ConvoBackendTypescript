
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler"
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";
import { getDummyConvo, getDummyConvoProps, getDummyUserProps } from "../../util/DummyFactory";
import { UniqueObjectAlreadyExistsError } from "../../../common/respositories/error";
import { ConvoRepository } from "../../../common/respositories/talking-point-post/ConvoRepository";
import { Convo } from "../../../common/objects/Convo";
import { User } from "../../../common/objects/user/User";
import { UserRepository } from "../../../common/respositories/user/UserRepository";

let v3Client: DynamoDBClient;
let convoRepository: ConvoRepository;
let convo: Convo;
jest.setTimeout(100000);

beforeAll(async () => {
  await startDb();
  console.log("process.env.MOCK_DYNAMODB_ENDPOINT: ", process.env.MOCK_DYNAMODB_ENDPOINT)

  v3Client = new DynamoDBClient({
    region: "us-east-1",
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    // requestHandler: new NodeHttpHandler({
    //   connectionTimeout: 1000000,
    //   socketTimeout: 1000000,
    // })
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

describe("ConvoRepository", () => {

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

  test("getByAuthorUsername() - succeeds retrieving by all 4 participants", async () => {
    const participantUsernames = ['user1', 'user2', 'user3', 'user4'];
    const testConvo = Convo.builder({
      ...getDummyConvoProps(),
      participantUsernames: participantUsernames
    });
    await convoRepository.save(testConvo);

    const getByUser1Response = await convoRepository.getByAuthorUsername({ username: participantUsernames[0] });
    expect(getByUser1Response?.data.length).toEqual(1);
    expect(getByUser1Response?.data[0]).toEqual(testConvo);
    expect(getByUser1Response?.queryHint).toBeDefined();

    const getByUser2Response = await convoRepository.getByAuthorUsername({ username: participantUsernames[1] });
    expect(getByUser2Response?.data.length).toEqual(1);
    expect(getByUser2Response?.data[0]).toEqual(testConvo);
    expect(getByUser2Response?.queryHint).toBeDefined();

    const getByUser3Response = await convoRepository.getByAuthorUsername({ username: participantUsernames[2] });
    expect(getByUser3Response?.data.length).toEqual(1);
    expect(getByUser3Response?.data[0]).toEqual(testConvo);
    expect(getByUser3Response?.queryHint).toBeDefined();

    const getByUser4Response = await convoRepository.getByAuthorUsername({ username: participantUsernames[3] });
    expect(getByUser4Response?.data.length).toEqual(1);
    expect(getByUser4Response?.data[0]).toEqual(testConvo);
    expect(getByUser4Response?.queryHint).toBeDefined();

    expect(getByUser1Response?.queryHint).not.toEqual(getByUser2Response?.queryHint);
    expect(getByUser2Response?.queryHint).not.toEqual(getByUser3Response?.queryHint);
    expect(getByUser3Response?.queryHint).not.toEqual(getByUser4Response?.queryHint);
  });

});

