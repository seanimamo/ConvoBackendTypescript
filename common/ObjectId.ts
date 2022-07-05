export abstract class ObjectId {
  public static readonly ID_DELIMETER = "#";

  protected _id: string;
  get id() { return this._id };



  // static fromId(id: string) {
  //   this._id = id;
  // }

  static createId(params: unknown[]) {
    const paramsToJoin: string[] = [];
    params.forEach(param => {
      switch (typeof (param)) {
        case 'string':
          paramsToJoin.push(param as string);
          break;
        case 'number' || 'boolean':
          paramsToJoin.push(`${param}`);
          break;
        default:
          const complexParam = param as any;
          if (complexParam instanceof Date) {
            paramsToJoin.push(ObjectId.dateToString(complexParam));
          } else {
            throw new Error("Unsupported data type passed to createId");
          }
      }
    });
    return paramsToJoin.join(ObjectId.ID_DELIMETER);
  }

  static parseId(id: string) {
    return id.split(ObjectId.ID_DELIMETER);
  }

  static dateToString(date: Date) {
    return date.toISOString();
  }
}