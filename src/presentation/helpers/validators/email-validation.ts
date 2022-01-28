import { InvalidParamError } from '../../errors';
import { EmailValidator } from '../../protocols/email-validator';
import { Validation } from '../../protocols/validation';

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator,
  ) {}

  validate<T>(data: T): void | Error {
    const isValid = this.emailValidator.isValid(data[this.fieldName]);

    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}