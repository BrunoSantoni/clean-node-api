import { MissingParamError } from '../../errors';
import { RequiredFieldValidation } from './required-field-validation';

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('any_field');
    const error = sut.validate({ field_without_correct_property: 'any_value' });

    expect(error).toEqual(new MissingParamError('any_field'));
  });

  test('Should not return if validation succeds', () => {
    const sut = new RequiredFieldValidation('field');
    const error = sut.validate({ field: 'any_value' });

    expect(error).toBeFalsy();
  });
});
