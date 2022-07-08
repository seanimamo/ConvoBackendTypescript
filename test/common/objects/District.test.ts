import { ClassSerializer } from "../../../common/util/ClassSerializer";
import { District, DistrictId } from "../../../common/objects/District";
import { getDummyDistrict } from "../../util/DummyFactory";
import { DataValidationError } from "../../../common/util/DataValidator";
import { ObjectId } from "../../../common/objects/ObjectId";

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
    
    test("validate() - succesfully validates a valid object", () => {
      expect(District.validate(district)).toBeUndefined();
    });
  
    test("validate() - throws error with invalid object", () => {
      const districtPlainJson = classSerializer.classToPlainJson(district);
      districtPlainJson['title'] = undefined;
      const districtClassFromPlainJson = classSerializer.plainJsonToClass(District, districtPlainJson);
      expect(() => District.validate(districtClassFromPlainJson)).toThrowError(DataValidationError);
    });

    test("DistrictId - is formatted as expected", () => {
      const params = {title: 'TestDistrict'}
      const districtId = new DistrictId(params);
      const parsedId = ObjectId.parseId(districtId);
      expect(parsedId[0]).toStrictEqual(DistrictId.IDENTIFIER);
      expect(parsedId[1]).toStrictEqual(params.title);
    });
  
  });