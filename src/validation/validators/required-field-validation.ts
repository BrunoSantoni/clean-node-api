import { MissingParamError } from '../../presentation/errors';
import { Validation } from '../../presentation/protocols';

export class RequiredFieldValidation implements Validation {
  constructor(
    private readonly fieldName: string,
  ) {}

  validate<T>(data: T): Error | void {
    if (!data[this.fieldName]) return new MissingParamError(this.fieldName);
  }
}
