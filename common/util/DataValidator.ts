export class DataValidator {
  data: any;
  dataLabel: string;

  validate(data: any, dataLabelContext: string) {
    this.data = data;
    this.dataLabel = dataLabelContext;
    return this;
  }

  isString() {
    if(typeof this.data !== 'string') {
      throw new DataValidationError(`data is not a string`);
    }
    return this;
  }

  isNumber() {
    if(typeof this.data !== 'number') {
      throw new DataValidationError(`data is not a number`);
    }
    return this;
  }

  isBoolean() {
    if(typeof this.data !== 'boolean') {
      throw new DataValidationError(`data is not a boolean`);
    }
    return this;
  }

  isDate() {
    if(!(this.data instanceof Date)) {
      throw new DataValidationError(`data is not a Date`);
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

  notUndefined() {
    if (this.data === undefined) {
      throw new DataValidationError(`${this.dataLabel} cannot be undefined`)
    }
    return this;
  }

  dateIsNotInFuture() {
    const currentDate = new Date();
    if(!(this.data instanceof Date)) {
      throw new InvalidDataTypeError(`dateIsNotInFuture() can only be called against Date objects`);
    }
    if (this.data > currentDate) {
      throw new DataValidationError(`${this.dataLabel} cannot be in the future`);
    }

    return this;
  }

  dateIsNotInPast() {
    const currentDate = new Date();
    if(!(this.data instanceof Date)) {
      throw new InvalidDataTypeError(`dateIsNotInPast() can only be called against Date objects`);
    }
    if (this.data < currentDate) {
      throw new DataValidationError(`${this.dataLabel} cannot be in the past`);
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