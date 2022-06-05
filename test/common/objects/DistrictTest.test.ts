import { ClassSerializer } from "../../../common/objects/ClassSerializer";
import { Category, District, ViewMode } from "../../../common/objects/district/District";

describe("Test District", () => {
    const district: District = District.builder({
        title: "string", 
        authorUsername: "string", 
        createDate: new Date(),
        subscriberCount: 0,
        viewCount: 0,
        postCount: 0,
        convoCount: 0,
        talkingPointCount: 0,
        isBanned: false,
        viewMode: ViewMode.PRIVATE,
        primaryCategory: Category.BUSINESS
    });
    const classSerializer = new ClassSerializer();
  
    test("Check that transforming the class to and from plain json does not change any data", () => {
      const districtPlainJson = classSerializer.classToPlainJson(district);
      console.log("district class turned to plain json: ", districtPlainJson);
      const districtClassFromPlainJson = classSerializer.plainJsonToClass(District, districtPlainJson);
      expect(districtClassFromPlainJson).toEqual(district);
    });
  
    test("Check that serializing and deserializing the class does not change any data", () => {
      const districtSerialized = classSerializer.serialize(district);
      const districtDeserialized = classSerializer.deserialize(District, districtSerialized);
      expect(districtDeserialized).toEqual(district);
    });
  
  });