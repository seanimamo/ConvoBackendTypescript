import { ClassSerializer } from "../../../common/util/ClassSerializer";
import { District } from "../../../common/objects/District";
import { getDummyDistrict } from "../../util/DummyFactory";
import { DataValidationError } from "../../../common/util/DataValidator";

describe("Test District", () => {
    const district = getDummyDistrict();
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
    
    // TODO: uncomment after validation is added.
    // test("validate succesfully validates a valid object", () => {
    //   expect(District.validate(district)).toBeUndefined();
    // });
  
    // test("validate throws error with invalid object", () => {
    //   const districtPlainJson = classSerializer.classToPlainJson(district);
    //   districtPlainJson['title'] = undefined;
    //   const districtClassFromPlainJson = classSerializer.plainJsonToClass(District, districtPlainJson);
    //   expect(() => District.validate(districtClassFromPlainJson)).toThrowError(DataValidationError);
    // });
  
  });