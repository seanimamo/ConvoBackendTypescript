export class ObjectDoesNotExistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ObjectDoesNotExistError";
  }
}