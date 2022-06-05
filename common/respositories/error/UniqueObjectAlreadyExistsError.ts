export class UniqueObjectAlreadyExistsError extends Error {
  constructor(message: string = "UniqueObjectAlreadyExistsError") {
    super(message);
    this.name = "UniqueObjectAlreadyExistsError";
  }
}

