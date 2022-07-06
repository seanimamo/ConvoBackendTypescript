
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";
import { getDummyConvo, getDummyConvoProps } from "../../util/DummyFactory";
import { InvalidParametersError, ObjectDoesNotExistError, UniqueObjectAlreadyExistsError } from "../../../common/respositories/error";
import { ConvoRepository } from "../../../common/respositories/talking-point-post/ConvoRepository";
import { Convo, ConvoId, ConvoStatus } from "../../../common/objects/Convo";

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
    await expect(convoRepository.getById(new ConvoId('asdf'))).resolves.toBeNull();
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

  test("getByAuthorUsername() - sorts by the latest date first", async () => {
    const participantUsernames = ['user1', 'user2', 'user3', 'user4'];
    const convo1 = Convo.builder({
      ...getDummyConvoProps(),
      participantUsernames: participantUsernames,
      acceptedUserNames: undefined,
      rejectedUserNames: undefined,
      createDate: new Date('2022-01-01'),
      status: ConvoStatus.NOT_ACCEPTED
    });
    const convo2 = Convo.builder({
      ...getDummyConvoProps(),
      participantUsernames: participantUsernames,
      acceptedUserNames: undefined,
      rejectedUserNames: undefined,
      createDate: new Date('2022-01-02'),
      status: ConvoStatus.NOT_ACCEPTED
    });
    const convo3 = Convo.builder({
      ...getDummyConvoProps(),
      participantUsernames: participantUsernames,
      acceptedUserNames: undefined,
      rejectedUserNames: undefined,
      createDate: new Date('2022-01-03'),
      status: ConvoStatus.NOT_ACCEPTED
    });
    await convoRepository.save(convo1);
    await convoRepository.save(convo2);
    await convoRepository.save(convo3);


    const response = await convoRepository.getByAuthorUsername({ username: participantUsernames[0] });
    expect(response.data).toHaveLength(3);
    expect(response.data[0]).toEqual(convo3);
    expect(response.data[1]).toEqual(convo2);
    expect(response.data[2]).toEqual(convo1);
  });

  test("getByAuthorUsername() - returns empty list when no results found", async () => {
    await convoRepository.save(convo);
    const response = await convoRepository.getByAuthorUsername({ username: "userWithNoConvos" });
    expect(response.data).toHaveLength(0);
  })

  test("acceptConvo() - sucessfully adds usernames to acceptedUsernames and updates convo status", async () => {
    const participantUsernames = ['user1', 'user2', 'user3'];
    const convo = Convo.builder({
      ...getDummyConvoProps(),
      participantUsernames: participantUsernames,
      acceptedUserNames: undefined,
      rejectedUserNames: undefined,
      createDate: new Date('2022-01-01'),
      status: ConvoStatus.NOT_ACCEPTED
    });
    await convoRepository.save(convo);

    // confirm the status changed to partially accepted
    const response = await convoRepository.acceptConvo(convo.id, participantUsernames[0]);
    expect(response).toBeDefined();
    expect(response.acceptedUserNames).toHaveLength(1);
    expect(response.acceptedUserNames).toContainEqual(participantUsernames[0]);
    expect(response.status).toStrictEqual(ConvoStatus.PARTIALLY_ACCEPTED);

    // Confirm that convo status does not change when an incomplete fraction of the users accepts
    // an already partially accepted status convo
    const response2 = await convoRepository.acceptConvo(convo.id, participantUsernames[1]);
    expect(response2).toBeDefined();
    expect(response2.acceptedUserNames).toHaveLength(2);
    expect(response2.acceptedUserNames).toContainEqual(participantUsernames[0]);
    expect(response2.acceptedUserNames).toContainEqual(participantUsernames[1]);
    expect(response2.status).toStrictEqual(ConvoStatus.PARTIALLY_ACCEPTED);

    const response3 = await convoRepository.acceptConvo(convo.id, participantUsernames[2]);
    expect(response3).toBeDefined();
    expect(response3.acceptedUserNames).toHaveLength(3);
    expect(response3.acceptedUserNames).toContainEqual(participantUsernames[0]);
    expect(response3.acceptedUserNames).toContainEqual(participantUsernames[1]);
    expect(response3.acceptedUserNames).toContainEqual(participantUsernames[2]);
    expect(response3.status).toStrictEqual(ConvoStatus.ACCEPTED);
  });

  test("acceptConvo() - throws error when trying to accept a convo that does not exist", async () => {
    await expect(convoRepository.acceptConvo(convo.id, convo.participantUsernames[0])).rejects.toThrow(ObjectDoesNotExistError);
  });

  test("acceptConvo() - throws error when a user who is not a participant tries to accept the convo", async () => {
    await convoRepository.save(convo);
    await expect(convoRepository.acceptConvo(convo.id, 'randomUser')).rejects.toThrow(InvalidParametersError);
  });

  test("acceptConvo() - throws error when a user who already accepted the convo tries to accept again", async () => {
    await convoRepository.save(convo);
    await convoRepository.acceptConvo(convo.id, convo.participantUsernames[0]);
    await expect(convoRepository.acceptConvo(convo.id, convo.participantUsernames[0])).rejects.toThrow(InvalidParametersError);
  });

  test("rejectConvo() - sucessfully adds usernames to rejectedUsersnames and updates convo status", async () => {
    const participantUsernames = ['user1', 'user2', 'user3'];
    const notAcceptedConvo = Convo.builder({
      ...getDummyConvoProps(),
      participantUsernames: participantUsernames,
      acceptedUserNames: undefined,
      rejectedUserNames: undefined,
      createDate: new Date('2022-01-01'),
      status: ConvoStatus.NOT_ACCEPTED
    });
    await convoRepository.save(notAcceptedConvo);

    const response = await convoRepository.rejectConvo(notAcceptedConvo.id, participantUsernames[0]);
    expect(response).toBeDefined();
    expect(response.rejectedUserNames).toHaveLength(1);
    expect(response.rejectedUserNames).toContainEqual(participantUsernames[0]);
    expect(response.status).toStrictEqual(ConvoStatus.REJECTED);

    const partiallyAcceptedConvo = Convo.builder({
      ...getDummyConvoProps(),
      participantUsernames: participantUsernames,
      acceptedUserNames: [participantUsernames[0]],
      rejectedUserNames: undefined,
      createDate: new Date('2022-01-02'),
      status: ConvoStatus.PARTIALLY_ACCEPTED
    });
    await convoRepository.save(partiallyAcceptedConvo);

    const response2 = await convoRepository.rejectConvo(partiallyAcceptedConvo.id, participantUsernames[0]);
    expect(response2).toBeDefined();
    expect(response2.rejectedUserNames).toHaveLength(1);
    expect(response2.rejectedUserNames).toContainEqual(participantUsernames[0]);
    expect(response2.status).toStrictEqual(ConvoStatus.REJECTED);

    const acceptedConvo = Convo.builder({
      ...getDummyConvoProps(),
      participantUsernames: participantUsernames,
      acceptedUserNames: participantUsernames,
      rejectedUserNames: undefined,
      createDate: new Date('2022-01-03'),
      status: ConvoStatus.ACCEPTED
    });
    await convoRepository.save(acceptedConvo);

    const response3 = await convoRepository.rejectConvo(acceptedConvo.id, participantUsernames[0]);
    expect(response3).toBeDefined();
    expect(response3.rejectedUserNames).toHaveLength(1);
    expect(response3.rejectedUserNames).toContainEqual(participantUsernames[0]);
    expect(response3.status).toStrictEqual(ConvoStatus.CANCELED);
  });

  test("rejectConvo() - throws error when trying to reject a convo that does not exist", async () => {
    await expect(convoRepository.rejectConvo(convo.id, convo.participantUsernames[0])).rejects.toThrow(ObjectDoesNotExistError);
  });

  test("rejectConvo() - throws error when a user who is not a participant tries to reject the convo", async () => {
    await convoRepository.save(convo);
    await expect(convoRepository.rejectConvo(convo.id, 'randomUser')).rejects.toThrow(InvalidParametersError);
  });

  test("rejectConvo() - throws error when a user who already rejected the convo tries to accept again", async () => {
    await convoRepository.save(convo);
    await convoRepository.rejectConvo(convo.id, convo.participantUsernames[0]);
    await expect(convoRepository.rejectConvo(convo.id, convo.participantUsernames[0])).rejects.toThrow(InvalidParametersError);
  });
});

