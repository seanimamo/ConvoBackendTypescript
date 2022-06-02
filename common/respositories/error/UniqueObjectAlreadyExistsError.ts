export class UniqueObjectAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UniqueObjectAlreadyExistsError";
  }
}

