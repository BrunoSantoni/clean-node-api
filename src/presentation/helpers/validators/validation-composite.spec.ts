import { InvalidParamError } from '../../errors';
import { Validation } from './validation';
import { ValidationComposite } from './validation-composite';

type SutTypes = {
  sut: ValidationComposite;
  validationStub: Validation;
};
const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate<T>(data: T): void | Error {
      return new InvalidParamError('field');
    }
  }

  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new ValidationComposite([validationStub]);

  return {
    sut,
    validationStub,
  };
};

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut } = makeSut();
    const error = sut.validate<{ field: string }>({ field: 'any_value' });

    expect(error).toEqual(new InvalidParamError('field'));
  });
});
