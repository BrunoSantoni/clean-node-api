import faker from '@faker-js/faker';
import { ValidationComposite } from './validation-composite';
import { InvalidParamError } from '@/presentation/errors';
import { ValidationSpy } from '@/presentation/test';

type SutTypes = {
  sut: ValidationComposite;
  validationSpies: ValidationSpy[];
};

const makeSut = (): SutTypes => {
  const validationSpies = [new ValidationSpy(), new ValidationSpy()];
  const sut = new ValidationComposite(validationSpies);

  return {
    sut,
    validationSpies,
  };
};

const fieldMock = faker.random.word();

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationSpies } = makeSut();
    validationSpies[0].error = new InvalidParamError(fieldMock);

    const error = sut.validate<{ field: string }>({ field: fieldMock });

    expect(error).toEqual(new InvalidParamError(fieldMock));
  });

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationSpies } = makeSut();
    validationSpies[0].error = new Error();
    validationSpies[1].error = new InvalidParamError(fieldMock);

    const error = sut.validate<{ field: string }>({ field: fieldMock });

    expect(error).toEqual(new Error());
  });

  test('Should not return an error if validation succeeds', () => {
    const { sut } = makeSut();

    const error = sut.validate<{ field: string }>({ field: fieldMock });

    expect(error).toBeFalsy();
  });
});
