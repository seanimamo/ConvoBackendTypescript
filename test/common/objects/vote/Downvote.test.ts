import { ObjectId } from "../../../../common/objects/ObjectId";
import { Downvote, DownvoteId, NegativeTrait } from "../../../../common/objects/vote/Downvote";
import { ClassSerializer } from "../../../../common/util/ClassSerializer";
import { DataValidationError } from "../../../../common/util/DataValidator";
import { getDummyDownvote, getDummyTalkingPointPost } from "../../../util/DummyFactory";


describe("Downvote", () => {
  const downvote = getDummyDownvote();
  const classSerializer = new ClassSerializer();

  test("Check that transforming the class to and from plain json does not change any data", () => {
    const plainJson = classSerializer.classToPlainJson(downvote);
    const classFromPlainJson = classSerializer.plainJsonToClass(Downvote, plainJson);
    expect(classFromPlainJson).toEqual(downvote);
  });

  test("Check that serializing and deserializing the class does not change any data", () => {
    const serialized = classSerializer.serialize(downvote);
    const deserialized = classSerializer.deserialize(Downvote, serialized);
    expect(deserialized).toEqual(downvote);
  });
  
  test("validate() - succesfully validates a valid object", () => {
    expect(Downvote.validate(downvote)).toBeUndefined();
  });

  test("validate() - throws error with invalid object", () => {
    const downvotePlainJson = classSerializer.classToPlainJson(downvote);
    downvotePlainJson['authorUserName'] = undefined;
    const downvoteClassFromPlainJson = classSerializer.plainJsonToClass(Downvote, downvotePlainJson);
    expect(() => Downvote.validate(downvoteClassFromPlainJson)).toThrowError(DataValidationError);
  });

  test("DownvoteId - is formatted as expected", () => {
    const params = {
        authorUserName:  'testUser',
        trait: NegativeTrait.DISTURBING,
        parentId: getDummyTalkingPointPost().id
    }
    const downvoteId = new DownvoteId(params);
    const parsedId = ObjectId.parseId(downvoteId);
    expect(parsedId[0]).toStrictEqual(DownvoteId.IDENTIFIER);
    expect(parsedId[1]).toStrictEqual(params.authorUserName);
    expect(parsedId[2]).toStrictEqual(params.trait);
    expect(parsedId[3]).toStrictEqual(params.parentId.getValue());
  });
});