import { InvalidParamError } from '../../errors';
import { Validation } from '../../protocols/validation';

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompareName: string,
  ) {}

  validate<T>(data: T): void | Error {
    if (data[this.fieldName] !== data[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName);
    }
  }
}
