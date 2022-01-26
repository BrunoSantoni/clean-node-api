import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { Validation } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  const requiredSignUpFields = ['name', 'email', 'password', 'passwordConfirmation'];

  requiredSignUpFields.forEach((field) => {
    validations.push(new RequiredFieldValidation(field));
  });
  return new ValidationComposite(validations);
};
