import { ValidationComposite } from './validation-composite';
import { InvalidParamError } from '@/presentation/errors';
import { Validation } from '@/presentation/protocols';
import { mockValidation } from '@/validation/test';

type SutTypes = {
  sut: ValidationComposite;
  validationStubs: Validation[];
};

const makeSut = (): SutTypes => {
  const validationStubs = [mockValidation(), mockValidation()];
  const sut = new ValidationComposite(validationStubs);

  return {
    sut,
    validationStubs,
  };
};

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], 'validate').mockImplementationOnce(() => new InvalidParamError('field'));

    const error = sut.validate<{ field: string }>({ field: 'any_value' });

    expect(error).toEqual(new InvalidParamError('field'));
  });

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new InvalidParamError('field'));

    const error = sut.validate<{ field: string }>({ field: 'any_value' });

    expect(error).toEqual(new Error());
  });

  test('Should not return an error if validation succeeds', () => {
    const { sut } = makeSut();

    const error = sut.validate<{ field: string }>({ field: 'any_value' });

    expect(error).toBeFalsy();
  });
});
