import { Validation } from '@/presentation/protocols';

export class ValidationSpy implements Validation {
  data: any;

  error: Error = null;

  validate<T>(data: T): void | Error {
    this.data = data;

    return this.error;
  }
}
