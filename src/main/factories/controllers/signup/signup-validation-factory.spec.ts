import {
  CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite,
} from '../../../../validation/validators';
import { Validation } from '../../../../presentation/protocols';
import { EmailValidator } from '../../../../validation/protocols/email-validator';
import { makeSignUpValidation } from './signup-validation-factory';

jest.mock('../../../../validation/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    const validations: Validation[] = [];
    const requiredSignUpFields = ['name', 'email', 'password', 'passwordConfirmation'];

    requiredSignUpFields.forEach((field) => {
      validations.push(new RequiredFieldValidation(field));
    });

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
    validations.push(new EmailValidation('email', makeEmailValidator()));

    makeSignUpValidation();
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
