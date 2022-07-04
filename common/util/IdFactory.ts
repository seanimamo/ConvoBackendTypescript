export class IdFactory {
  public static readonly ID_DELIMETER = "#";

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
            paramsToJoin.push(IdFactory.dateToString(complexParam));
          } else {
            throw new Error("Unsupported data type passed to createId");
          }
      }
    });
    return paramsToJoin.join(IdFactory.ID_DELIMETER);
  }

  static parseId(id: string) {
    return id.split(IdFactory.ID_DELIMETER);
  }

  static dateToString(date: Date) {
    return date.toISOString();
  }
}