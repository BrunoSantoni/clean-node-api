import { Validation } from '@/presentation/protocols';
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators';

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  const requiredAddSurveyFields = ['question', 'answers'];

  requiredAddSurveyFields.forEach((field) => {
    validations.push(new RequiredFieldValidation(field));
  });

  return new ValidationComposite(validations);
};
