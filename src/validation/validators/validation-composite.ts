import { Validation } from '@/presentation/protocols';

export class ValidationComposite implements Validation {
  constructor(
    private readonly validations: Validation[],
  ) {}

  validate<T>(data: T): Error | void {
    for (const validation of this.validations) {
      const error = validation.validate<T>(data);

      if (error) return error;
    }
  }
}
