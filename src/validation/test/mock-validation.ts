import { Validation } from '@/presentation/protocols';

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate<T>(data: T): void | Error {
      return null;
    }
  }

  return new ValidationStub();
};
