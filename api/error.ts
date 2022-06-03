export class InvalidRequestException extends Error {
  constructor(message = 'Request has one or more missing or invalid attributes') {
    super(message);
    this.name = "InvalidRequestException";
  }
}