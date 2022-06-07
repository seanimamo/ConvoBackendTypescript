// TransformDate.ts
import { Transform } from "class-transformer";

// Sourced from: https://stackoverflow.com/questions/59899045/plaintoclass-does-not-convert-a-date-to-string
// (Note I made a slight modification) based on a comment,
// "Note that in more recent versions, the argument to Transform function is now an object that has a value prop rather than just the value, so it needs to be extracted. E.g. with destructuring @Transform(({ value }) => ..."
// Another method of doing the same thing: https://github.com/typestack/class-transformer/blob/master/sample/sample5-custom-transformer/User.ts
export default function TransformDate() {
  const toPlain = Transform(({ value }) => (value as Date).toISOString(), {
    toPlainOnly: true,
  });

  const toClass = Transform(({ value }) => new Date(value), {
    toClassOnly: true,
  });

  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
}