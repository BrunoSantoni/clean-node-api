import { Validation } from '@/presentation/protocols';

export const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate<T>(data: T): Error | void {
      return null;
    }
  }

  return new ValidationStub();
};
