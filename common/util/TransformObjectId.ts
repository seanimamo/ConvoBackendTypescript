// TransformDate.ts
import { ClassConstructor, Transform } from "class-transformer";
import { ObjectId } from "../ObjectId";

// Sourced from: https://stackoverflow.com/questions/59899045/plaintoclass-does-not-convert-a-date-to-string
// (Note I made a slight modification) based on a comment,
// "Note that in more recent versions, the argument to Transform function is now an object that has a value prop rather than just the value, so it needs to be extracted. E.g. with destructuring @Transform(({ value }) => ..."
// Another method of doing the same thing: https://github.com/typestack/class-transformer/blob/master/sample/sample5-custom-transformer/User.ts
export default function TransformObjectId<T extends ObjectId>(objectIdClazz: ClassConstructor<T>) {
  const toPlain = Transform(
    ({ value }) => value === undefined ? undefined : (value as ObjectId).getValue(),
    { toPlainOnly: true, });

  const toClass = Transform(
    ({ value }) => value === undefined ? undefined : new objectIdClazz(value),
    { toClassOnly: true, });

  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
}