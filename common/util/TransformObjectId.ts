import 'reflect-metadata'; //required for class transformer to work;
import { Transform } from "class-transformer";
import { ConvoId } from "../objects/Convo";
import { DistrictId } from "../objects/District";
import { GeneralChatRequestId } from "../objects/talking-point-post/GeneralChatRequest";
import { TalkingPointPostId } from "../objects/talking-point-post/TalkingPointPost";
import { ObjectId } from "../objects/ObjectId";

/**
 * Transformer Sourced from: https://stackoverflow.com/questions/59899045/plaintoclass-does-not-convert-a-date-to-string
 * Another method of doing the same thing: https://github.com/typestack/class-transformer/blob/master/sample/sample5-custom-transformer/User.ts
 * 
 * @returns A Property Decorator for used with class-transformer to turn an marshall an ObjectId
 */
export default function TransformObjectId() {
  const toPlain = Transform(
    ({ value }) => value === undefined ? undefined : (value as ObjectId).getValue(),
    { toPlainOnly: true, });

  const toClass = Transform(
    ({ value }) => {
      if (value === undefined) {
        return undefined;
      }
      const identifier = ObjectId.getIdentifier(value);
      switch (identifier) {
        case ConvoId.IDENTIFIER:
          return new ConvoId(value);
        case DistrictId.IDENTIFIER:
          return new DistrictId(value);
        case "POST_TALKING_POINT":
          return new TalkingPointPostId(value);
        case GeneralChatRequestId.IDENTIFIER:
          return new GeneralChatRequestId(value);
        default:
          throw new Error(`Unknown Id Identifier: ${identifier}`)
      }
    },
    { toClassOnly: true, });

  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
}