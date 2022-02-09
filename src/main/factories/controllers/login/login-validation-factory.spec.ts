import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators';
import { Validation } from '../../../../presentation/protocols';
import { EmailValidator } from '../../../../validation/protocols/email-validator';
import { makeLoginValidation } from './login-validation-factory';

jest.mock('../../../../validation/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    const validations: Validation[] = [];
    const requiredSignUpFields = ['email', 'password'];

    requiredSignUpFields.forEach((field) => {
      validations.push(new RequiredFieldValidation(field));
    });

    validations.push(new EmailValidation('email', makeEmailValidator()));

    makeLoginValidation();
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
