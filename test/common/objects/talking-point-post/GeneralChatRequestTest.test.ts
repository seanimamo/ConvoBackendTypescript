
import { getDummyGeneralChatRequest } from "../../../util/DummyFactory";
import { GeneralChatRequest } from "../../../../common/objects/talking-point-post/GeneralChatRequest";
import { ClassSerializer } from "../../../../common/util/ClassSerializer";
import { DataValidationError } from "../../../../common/util/DataValidator";

describe("Test General Chat Request ", () => {
  const chatRequest: GeneralChatRequest = getDummyGeneralChatRequest();
  const classSerializer = new ClassSerializer();

  test("Check that transforming the class to and from plain json does not change any data", () => {
    const chatRequestPlainJson = classSerializer.classToPlainJson(chatRequest);
    console.log("GeneralChatRequest class turned to plain json: ", chatRequestPlainJson);
    const chatRequestClassFromPlainJson = classSerializer.plainJsonToClass(GeneralChatRequest, chatRequestPlainJson);
    expect(chatRequestClassFromPlainJson).toEqual(chatRequest);
  });

  test("Check that serializing and deserializing the class does not change any data", () => {
    const chatRequestSerialized = classSerializer.serialize(chatRequest);
    const chatRequestDeserialized = classSerializer.deserialize(GeneralChatRequest, chatRequestSerialized);
    expect(chatRequestDeserialized).toEqual(chatRequest);
  });

  test("validate succesfully validates a valid object", () => {
    expect(GeneralChatRequest.validate(chatRequest)).toBeUndefined();
  });

  test("validate throws error with invalid object", () => {
    const chatRequestPlainJson = classSerializer.classToPlainJson(chatRequest);
    chatRequestPlainJson['parentType'] = "somethingNotInTheParentTypeEnum";
    const chatRequestClassFromPlainJson = classSerializer.plainJsonToClass(GeneralChatRequest, chatRequestPlainJson);
    expect(() => GeneralChatRequest.validate(chatRequestClassFromPlainJson)).toThrowError(DataValidationError);
  });

});