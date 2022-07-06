import { ClassConstructor } from "class-transformer";

export class DataValidator {
  data: any;
  dataLabel: string;

  

  validate(data: any, dataLabelContext: string) {
    this.data = data;
    this.dataLabel = dataLabelContext;
    return this;
  }

  isString() {
    if (typeof this.data !== 'string') {
      throw new DataValidationError(`${this.dataLabel} is not a string`);
    }
    return this;
  }

  isNumber() {
    if (typeof this.data !== 'number') {
      throw new DataValidationError(`${this.dataLabel} is not a number`);
    }
    return this;
  }

  isBoolean() {
    if (typeof this.data !== 'boolean') {
      throw new DataValidationError(`${this.dataLabel} is not a boolean`);
    }
    return this;
  }

  isDate() {
    if (!(this.data instanceof Date)) {
      throw new DataValidationError(`${this.dataLabel} is not a Date`);
    }
    return this;
  }

  isClass<T>(classType: ClassConstructor<T>) {
    if (!(this.data instanceof classType)) {
      throw new DataValidationError(`${this.dataLabel} is an invalid class type`);
    }
    return this;
  }

  notNull() {
    if (this.data === null) {
      throw new DataValidationError(`${this.dataLabel} cannot be null`)
    }
    return this;
  }

  notEmpty() {
    if (this.data.length === 0) {
      throw new DataValidationError(`${this.dataLabel} cannot be empty`)
    }
    return this;
  }

  isUndefined() {
    if (this.data != undefined) {
      throw new DataValidationError(`${this.dataLabel} must be undefined`)
    }
    return this;
  }

  notUndefined() {
    if (this.data === undefined) {
      throw new DataValidationError(`${this.dataLabel} cannot be undefined`)
    }
    return this;
  }

  dateIsNotInFuture() {
    const currentDate = new Date();
    if (!(this.data instanceof Date)) {
      throw new InvalidDataTypeError(`dateIsNotInFuture() can only be called against Date objects`);
    }
    if (this.data > currentDate) {
      throw new DataValidationError(`${this.dataLabel} cannot be in the future`);
    }

    return this;
  }

  dateIsNotInPast() {
    const currentDate = new Date();
    if (!(this.data instanceof Date)) {
      throw new InvalidDataTypeError(`dateIsNotInPast() can only be called against Date objects`);
    }
    if (this.data < currentDate) {
      throw new DataValidationError(`${this.dataLabel} cannot be in the past`);
    }

    return this;
  }

  notNegative() {
    if (this.data < 0) {
      throw new DataValidationError(`${this.dataLabel} cannot be negative`);
    }
  }

  /**
   * Source: https://stackoverflow.com/questions/17380845/how-do-i-convert-a-string-to-enum-in-typescript
   * (See the answer by Artur A)
   */
  isStringInEnum<T> (enm: { [s: string]: T}) {
    if (!(Object.values(enm) as unknown as string[]).includes(this.data)) {
      throw new DataValidationError(`${this.dataLabel} contains a value that is not a member of its respective Enum`);
    }
    return this;
  }
}

export class DataValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DataValidationError";
  }
}

export class InvalidDataTypeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidDataTypeError";
  }
}