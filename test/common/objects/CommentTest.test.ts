import { ClassSerializer } from "../../../common/objects/ClassSerializer";
import { Comment } from "../../../common/objects/comment/Comment";

describe("Test Comment", () => {
    const comment: Comment = Comment.builder({
        id: "string",
        parentId: "string",
        authorUsername: "string",
        createDate: "string",
        body: "string",
        upVotes: 0,
        downVotes: 0,
        isEdited: false,
        isBanned: false,
        score: 0
    });
    const classSerializer = new ClassSerializer();
  
    test("Check that transforming the class to and from plain json does not change any data", () => {
      const commentPlainJson = classSerializer.classToPlainJson(comment);
      console.log("comment class turned to plain json: ", commentPlainJson);
      const commentClassFromPlainJson = classSerializer.plainJsonToClass(Comment, commentPlainJson);
      expect(commentClassFromPlainJson).toEqual(comment);
    });
  
    test("Check that serializing and deserializing the class does not change any data", () => {
      const commentSerialized = classSerializer.serialize(comment);
      const commentDeserialized = classSerializer.deserialize(Comment, commentSerialized);
      expect(commentDeserialized).toEqual(comment);
    });
  
  });