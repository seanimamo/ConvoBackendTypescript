import { ClassSerializer } from "../../../../common/util/ClassSerializer";
import { TalkingPointPost } from "../../../../common/objects/talking-point-post/TalkingPointPost";
import { getDummyTalkingPointPost } from "../../../util/DummyFactory";
import { DataValidationError } from "../../../../common/util/DataValidator";

describe("Test Talking Point Post", () => {
  const talkingPointPost: TalkingPointPost = getDummyTalkingPointPost();
  const classSerializer = new ClassSerializer();

  test("Check that transforming the class to and from plain json does not change any data", () => {
    const postPlainJson = classSerializer.classToPlainJson(talkingPointPost);
    console.log("Talking Point Post class turned to plain json: ", postPlainJson);
    const postClassFromPlainJson = classSerializer.plainJsonToClass(TalkingPointPost, postPlainJson);
    expect(postClassFromPlainJson).toEqual(talkingPointPost);
  });

  test("Check that serializing and deserializing the class does not change any data", () => {
    const postSerialized = classSerializer.serialize(talkingPointPost);
    const postDeserialized = classSerializer.deserialize(TalkingPointPost, postSerialized);
    expect(postDeserialized).toEqual(talkingPointPost);
  });

  test("validate succesfully validates a valid object", () => {
    expect(TalkingPointPost.validate(talkingPointPost)).toBeUndefined();
  });

  test("validate throws error with invalid object", () => {
    const talkingPointPostPlainJson = classSerializer.classToPlainJson(talkingPointPost);
    talkingPointPostPlainJson['id'] = undefined;
    const talkingPointPostClassFromPlainJson = classSerializer.plainJsonToClass(TalkingPointPost, talkingPointPostPlainJson);
    expect(() => TalkingPointPost.validate(talkingPointPostClassFromPlainJson)).toThrowError(DataValidationError);
  });

    test("Changing the title, authorUserName or parentId automatically updates the object id", () => {
      const originalId = talkingPointPost.id;
      talkingPointPost.title = "new title";
      expect(talkingPointPost.id).not.toEqual(originalId);
      const changedId1 = talkingPointPost.id;
      talkingPointPost.authorUserName = "newUsername";
      expect(talkingPointPost.id).not.toEqual(changedId1);
      const changedId2 = talkingPointPost.id;
      talkingPointPost.parentId = "aDiffParentIddd";
      expect(talkingPointPost.id).not.toEqual(changedId2);
  });

});