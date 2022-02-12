import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators';
import { Validation } from '../../../../presentation/protocols/validation';

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  const requiredAddSurveyFields = ['question', 'answers'];

  requiredAddSurveyFields.forEach((field) => {
    validations.push(new RequiredFieldValidation(field));
  });

  return new ValidationComposite(validations);
};
