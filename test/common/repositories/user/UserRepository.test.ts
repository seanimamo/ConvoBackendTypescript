
import { User } from "../../../../common/objects/user/User";
import { UserRepository } from "../../../../common/respositories/user/UserRepository";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { startDb, stopDb, createTables, deleteTables } from "jest-dynalite";
import { getDummyUser, getDummyUserProps } from "../../../util/DummyFactory";
import { EmailAlreadyInUseError, UsernameAlreadyInUseError } from "../../../../common/respositories/user/error";
import { InvalidParametersError, ObjectDoesNotExistError } from "../../../../common/respositories/error";

let v3Client: DynamoDBClient;
let userRepository: UserRepository;
let user: User;
jest.setTimeout(1000000);

beforeAll(async () => {
  await startDb();

  v3Client = new DynamoDBClient({
    region: "us-east-1",
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT
  });
  userRepository = new UserRepository(v3Client);
});

beforeEach(async () => {
  await createTables();
  user = getDummyUser();
})

afterEach(async () => {
  await deleteTables();
})

afterAll(async () => {
  await v3Client.destroy();
  await stopDb();
})

describe("Test User Repository", () => {
  test("Saving new user succeeds", async () => {
    await userRepository.save(user);
  });

  test("Getting an existing user by userName succeeds", async () => {
    await userRepository.save(user);
    await expect(userRepository.getByUsername(user.userName)).resolves.toEqual(user);
  });

  test("Getting a nonexistant user by userName returns null", async () => {
    await userRepository.save(user);
    await expect(userRepository.getByUsername(user.userName + 'asd')).resolves.toBeNull();
  });

  test("Saving a user with a prexisting userName fails", async () => {
    await userRepository.save(user);
    user.email = "aDiffEmail@gmail.com";
    await expect(userRepository.save(user)).rejects.toThrow(UsernameAlreadyInUseError);
  });

  test("Saving a user with a prexisting email fails", async () => {
    await userRepository.save(user);
    const newUserWithDuplicateEmail = User.builder({
      ...getDummyUserProps(),
      userName : "aDifferentUsername",
      email: user.email
    });
  
    await expect(userRepository.save(newUserWithDuplicateEmail)).rejects.toThrow(EmailAlreadyInUseError);
  });

  test("Updating user IsEmailValidated works", async () => {
    await userRepository.save(user);
    await userRepository.updateIsEmailValidated(user.userName, !user.isEmailValidated);
    const updatedUser = await userRepository.getByUsername(user.userName) as User;
    expect(updatedUser.isEmailValidated).toEqual(!user.isEmailValidated);
  });

  test("Updating user IsEmailValidated fails if user does not exist", async () => {
    await expect(userRepository.updateIsEmailValidated("userThatDoesntExisttt", user.isEmailValidated))
    .rejects.toThrow(ObjectDoesNotExistError);
  });

  test("updateProfile() - succeeds in updating all values", async () => {
    await userRepository.save(user);
    const updatedFirstName = "newFirstName";
    const updatedLastName = "newFirstName";
    const updatedthumbnail = "updatedthumbnail";
    const updatedbio = "updatedbio"
    const updatedlocation = "updatedlocation"
    const updatedprofession = "updatedprofession"
    const updatedsettings = {
      ...user.settings,
      hideRealName: !user.settings.hideRealName
    }

    const updatedUser = await userRepository.updateProfile({
      userName: user.userName,
      firstName: updatedFirstName,
      lastName: updatedLastName,
      thumbnail: updatedthumbnail,
      bio: updatedbio,
      location: updatedlocation,
      profession: updatedprofession,
      settings: updatedsettings
    });

    expect(updatedUser.firstName).toStrictEqual(updatedFirstName);
    expect(updatedUser.lastName).toStrictEqual(updatedLastName);
    expect(updatedUser.thumbnail).toStrictEqual(updatedthumbnail);
    expect(updatedUser.bio).toStrictEqual(updatedbio);
    expect(updatedUser.location).toStrictEqual(updatedlocation);
    expect(updatedUser.profession).toStrictEqual(updatedprofession);
    expect(updatedUser.settings).toStrictEqual(updatedsettings);
  });

  test("updateProfile() - fails if user does not exist", async () => {
    await expect(userRepository.updateProfile({userName: "userThatDoesntExistt", firstName: 'newFirstName'}))
    .rejects.toThrow(ObjectDoesNotExistError);
  });

  test("updateProfile() - fails if no update parameters are provided", async () => {
    await expect(userRepository.updateProfile({userName: "userThatDoesntExistt"}))
    .rejects.toThrow(InvalidParametersError);
  });
});
