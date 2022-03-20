import { makeSignUpValidation } from './signup-validation-factory';
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter';
import { Validation } from '@/presentation/protocols';
import {
  CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite,
} from '@/validation/validators';

jest.mock('@/validation/validators/validation-composite');

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    const validations: Validation[] = [];
    const requiredSignUpFields = ['name', 'email', 'password', 'passwordConfirmation'];

    requiredSignUpFields.forEach((field) => {
      validations.push(new RequiredFieldValidation(field));
    });

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

    makeSignUpValidation();
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
