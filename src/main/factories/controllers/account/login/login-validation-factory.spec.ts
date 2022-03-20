import { Validation } from '@/presentation/protocols';
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators';
import { makeLoginValidation } from './login-validation-factory';
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter';

jest.mock('@/validation/validators/validation-composite');

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    const validations: Validation[] = [];
    const requiredSignUpFields = ['email', 'password'];

    requiredSignUpFields.forEach((field) => {
      validations.push(new RequiredFieldValidation(field));
    });

    validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

    makeLoginValidation();
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
