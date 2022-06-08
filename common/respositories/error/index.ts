export class ObjectDoesNotExistError extends Error {
  constructor(message: string = 'The object does not exist') {
    super(message);
    this.name = "ObjectDoesNotExistError";
  }
}

export class ParentObjectDoesNotExistError extends Error {
  constructor(message: string = "The parent object does not exist") {
    super(message);
    this.name = "ParentObjectDoesNotExistError";
  }
}

export class UniqueObjectAlreadyExistsError extends Error {
  constructor(message: string = "The object already exists") {
    super(message);
    this.name = "UniqueObjectAlreadyExistsError";
  }
}