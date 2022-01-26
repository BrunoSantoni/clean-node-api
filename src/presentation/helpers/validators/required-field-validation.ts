import { MissingParamError } from '../../errors';
import { Validation } from './validation';

export class RequiredFieldValidation implements Validation {
  constructor(
    private readonly fieldName: string,
  ) {}

  validate<T>(data: T): Error | void {
    if (!data[this.fieldName]) return new MissingParamError(this.fieldName);
  }
}
