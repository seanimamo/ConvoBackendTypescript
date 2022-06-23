import { Convo } from "../../../common/objects/Convo";
import { ClassSerializer } from "../../../common/util/ClassSerializer";
import { DataValidationError } from "../../../common/util/DataValidator";
import { getDummyConvo } from "../../util/DummyFactory";


describe("Test Convo", () => {
  const convo = getDummyConvo();
  const classSerializer = new ClassSerializer();

  test("Check that transforming the class to and from plain json does not change any data", () => {
    const convoPlainJson = classSerializer.classToPlainJson(convo);
    console.log("convo class turned to plain json: ", convoPlainJson);
    const convoClassFromPlainJson = classSerializer.plainJsonToClass(Convo, convoPlainJson);
    expect(convoClassFromPlainJson).toEqual(convo);
  });

  test("Check that serializing and deserializing the class does not change any data", () => {
    const convoSerialized = classSerializer.serialize(convo);
    const convoDeserialized = classSerializer.deserialize(Convo, convoSerialized);
    expect(convoDeserialized).toEqual(convo);
  });
  
  test("validate succesfully validates a valid object", () => {
    expect(Convo.validate(convo)).toBeUndefined();
  });

  test("validate throws error with invalid object", () => {
    const convoPlainJson = classSerializer.classToPlainJson(convo);
    convoPlainJson['title'] = undefined;
    const convoClassFromPlainJson = classSerializer.plainJsonToClass(Convo, convoPlainJson);
    expect(() => Convo.validate(convoClassFromPlainJson)).toThrowError(DataValidationError);
  });

});