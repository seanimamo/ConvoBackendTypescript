export class EmailAlreadyInUseError extends Error {
  constructor(message: string = "The email is already in use") {
    super(message);
    this.name = "EmailAlreadyInUseError";
  }
}

export class UsernameAlreadyInUseError extends Error {
  constructor(message: string = "Username already exists") {
    super(message);
    this.name = "UsernameAlreadyInUseError";
  }
}

export class UsernameDoesNotExist extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UsernameDoesNotExist";
  }
}