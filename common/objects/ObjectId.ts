export abstract class ObjectId {
  public static readonly ID_DELIMETER = "#";

  private readonly _id: string;
  public getValue() { return this._id };

  // Used to allow base abstract class to consistently insert identifier into the id.
  public abstract getIdentifier(): string; 

  constructor(params: unknown[] | string) {
    if (typeof (params) === 'string') {
      this._id = params;
    } else if (Array.isArray(params)) {
      this._id = ObjectId.createId([this.getIdentifier(), ...params]);
    } else {
      throw new Error("Unknown param type provided to ObjectId constructor");
    }
  }

  private static createId(params: unknown[]) {
    const paramsToJoin: string[] = [];
    params.forEach(param => {
      ObjectId.serializeAndAddToArray(param, paramsToJoin);
    });
    return paramsToJoin.join(ObjectId.ID_DELIMETER);
  }

  private static serializeAndAddToArray(param: unknown, array: string[]) {
    if (Array.isArray(param)) {
      param.forEach(x => ObjectId.serializeAndAddToArray(x, array));
      return;
    }

    switch (typeof (param)) {
      case 'string':
        array.push(param as string);
        break;
      case 'number' || 'boolean':
        array.push(`${param}`);
        break;
      default:
        const complexParam = param as any;
        if (complexParam instanceof Date) {
          array.push(ObjectId.dateToString(complexParam));
        } else {
          throw new Error("Unsupported data type passed to createId");
        }
    }
  }

  static parseId(id: string | ObjectId) {
    if (id instanceof ObjectId) {
      return id.getValue().split(ObjectId.ID_DELIMETER);
    } 
    return id.split(ObjectId.ID_DELIMETER);
  }

  static dateToString(date: Date) {
    return date.toISOString();
  }

  static getIdentifier(id: string) {
    return ObjectId.parseId(id)[0];
  }
}