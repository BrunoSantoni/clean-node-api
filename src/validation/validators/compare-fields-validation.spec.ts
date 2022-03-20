import faker from '@faker-js/faker';
import { InvalidParamError } from '@/presentation/errors';
import { CompareFieldsValidation } from './compare-fields-validation';

const field = faker.random.word();
const fieldToCompare = faker.random.word();

const makeSut = (): CompareFieldsValidation => new CompareFieldsValidation(field, fieldToCompare);

describe('Compare Fields Validation', () => {
  test('Should return an InvalidParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({
      [field]: faker.random.word(), // Usou o field como key
      [fieldToCompare]: faker.random.word(), // Usou o field compare como key
    });

    expect(error).toEqual(new InvalidParamError(fieldToCompare));
  });

  test('Should not return if validation succeeds', () => {
    const sut = makeSut();
    const value = faker.random.word();

    const error = sut.validate({
      [field]: value,
      [fieldToCompare]: value,
    });

    expect(error).toBeFalsy();
  });
});
