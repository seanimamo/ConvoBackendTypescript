import { ClassSerializer } from "../../../common/util/ClassSerializer";
import { LinkPreview } from "../../../common/objects/talking-point-post/LinkPreview";
import { getDummyLinkPreview } from "../../util/DummyFactory";
import { DataValidationError } from "../../../common/util/DataValidator";

describe("Test LinkPreview", () => {
    const linkPreview = getDummyLinkPreview();
    const classSerializer = new ClassSerializer();
  
    test("Check that transforming the class to and from plain json does not change any data", () => {
      const objectPlainJson = classSerializer.classToPlainJson(linkPreview);
      console.log("linkPreview class turned to plain json: ", objectPlainJson);
      const linkPreviewClassFromPlainJson = classSerializer.plainJsonToClass(LinkPreview, objectPlainJson);
      expect(linkPreviewClassFromPlainJson).toEqual(linkPreview);
    });
  
    test("Check that serializing and deserializing the class does not change any data", () => {
      const linkPreviewSerialized = classSerializer.serialize(linkPreview);
      const linkPreviewDeserialized = classSerializer.deserialize(LinkPreview, linkPreviewSerialized);
      expect(linkPreviewDeserialized).toEqual(linkPreview);
    });
    
    test("validate succesfully validates a valid object", () => {
      expect(LinkPreview.validate(linkPreview)).toBeUndefined();
    });
  
    test("validate throws error with invalid object", () => {
      const objectPlainJson = classSerializer.classToPlainJson(linkPreview);
      objectPlainJson['url'] = undefined;
      const linkPreviewClassFromPlainJson = classSerializer.plainJsonToClass(LinkPreview, objectPlainJson);
      expect(() => LinkPreview.validate(linkPreviewClassFromPlainJson)).toThrowError(DataValidationError);
    });
  
  });