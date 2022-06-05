export class DistrictAlreadyExists extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DistrictAlreadyExists";
  }
}