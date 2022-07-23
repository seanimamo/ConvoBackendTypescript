import { ObjectId } from "../../../../common/objects/ObjectId";
import { PositiveTrait, Upvote, UpvoteId } from "../../../../common/objects/vote/Upvote";
import { ClassSerializer } from "../../../../common/util/ClassSerializer";
import { DataValidationError } from "../../../../common/util/DataValidator";
import { getDummyTalkingPointPost, getDummyUpvote } from "../../../util/DummyFactory";


describe("Upvote", () => {
  const upvote = getDummyUpvote();
  const classSerializer = new ClassSerializer();

  test("Check that transforming the class to and from plain json does not change any data", () => {
    const plainJson = classSerializer.classToPlainJson(upvote);
    const classFromPlainJson = classSerializer.plainJsonToClass(Upvote, plainJson);
    expect(classFromPlainJson).toEqual(upvote);
  });

  test("Check that serializing and deserializing the class does not change any data", () => {
    const serialized = classSerializer.serialize(upvote);
    const deserialized = classSerializer.deserialize(Upvote, serialized);
    expect(deserialized).toEqual(upvote);
  });
  
  test("validate() - succesfully validates a valid object", () => {
    expect(Upvote.validate(upvote)).toBeUndefined();
  });

  test("validate() - throws error with invalid object", () => {
    const upvotePlainJson = classSerializer.classToPlainJson(upvote);
    upvotePlainJson['authorUserName'] = undefined;
    const upvoteClassFromPlainJson = classSerializer.plainJsonToClass(Upvote, upvotePlainJson);
    expect(() => Upvote.validate(upvoteClassFromPlainJson)).toThrowError(DataValidationError);
  });

  test("UpvoteId - is formatted as expected", () => {
    const params = {
        authorUserName:  'testUser',
        trait: PositiveTrait.HIGH_QUALITY,
        parentId: getDummyTalkingPointPost().id
    }
    const upvoteId = new UpvoteId(params);
    const parsedId = ObjectId.parseId(upvoteId);
    expect(parsedId[0]).toStrictEqual(UpvoteId.IDENTIFIER);
    expect(parsedId[1]).toStrictEqual(params.authorUserName);
    expect(parsedId[2]).toStrictEqual(params.trait);
    expect(parsedId[3]).toStrictEqual(params.parentId.getValue());
  });
});