import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter';
import { Validation } from '@/presentation/protocols/validation';
import {
  CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite,
} from '@/validation/validators';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  const requiredSignUpFields = ['name', 'email', 'password', 'passwordConfirmation'];

  requiredSignUpFields.forEach((field) => {
    validations.push(new RequiredFieldValidation(field));
  });

  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
