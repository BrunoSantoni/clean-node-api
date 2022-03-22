import { EmailValidatorAdapter } from '@/infra/validators';
import { Validation } from '@/presentation/protocols';
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators';

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  const requiredLoginFields = ['email', 'password'];

  requiredLoginFields.forEach((field) => {
    validations.push(new RequiredFieldValidation(field));
  });

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
