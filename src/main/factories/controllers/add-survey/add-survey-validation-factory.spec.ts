import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators';
import { Validation } from '../../../../presentation/protocols';
import { makeAddSurveyValidation } from './add-survey-validation-factory';

jest.mock('../../../../validation/validators/validation-composite');

describe('AddSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    const validations: Validation[] = [];
    const requiredSignUpFields = ['question', 'answers'];

    requiredSignUpFields.forEach((field) => {
      validations.push(new RequiredFieldValidation(field));
    });

    makeAddSurveyValidation();
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
