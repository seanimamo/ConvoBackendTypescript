import { ClassSerializer } from "../../../../common/util/ClassSerializer";
import { TalkingPointPost } from "../../../../common/objects/talking-point-post/TalkingPointPost";
import { getDummyTalkingPointPost } from "../../../util/DummyFactory";

describe("Test Talking Point Post", () => {
  const talkingPointPost: TalkingPointPost = getDummyTalkingPointPost();
  const classSerializer = new ClassSerializer();

  test("Check that transforming the class to and from plain json does not change any data", () => {
    const postPlainJson = classSerializer.classToPlainJson(talkingPointPost);
    console.log("district class turned to plain json: ", postPlainJson);
    const postClassFromPlainJson = classSerializer.plainJsonToClass(TalkingPointPost, postPlainJson);
    expect(postClassFromPlainJson).toEqual(talkingPointPost);
  });

  test("Check that serializing and deserializing the class does not change any data", () => {
    const postSerialized = classSerializer.serialize(talkingPointPost);
    const postDeserialized = classSerializer.deserialize(TalkingPointPost, postSerialized);
    expect(postDeserialized).toEqual(talkingPointPost);
  });

  

});