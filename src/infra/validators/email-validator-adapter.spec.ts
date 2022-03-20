import faker from '@faker-js/faker';
import validator from 'validator';
import { EmailValidatorAdapter } from './email-validator-adapter';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

const makeSut = (): EmailValidatorAdapter => new EmailValidatorAdapter();

let fakeEmail: string;

/* Componente wrapper que encapsulará o validator, vai injetar a dependência na
camada de presentation */
describe('EmailValidator Adapter', () => {
  beforeEach(() => {
    fakeEmail = faker.internet.email();
  });

  test('Should return false if validator returns false', () => {
    const sut = makeSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    // No teste unitário não quer saber como validar um email
    const isValid = sut.isValid(fakeEmail);

    expect(isValid).toBe(false);
  });

  test('Should return true if validator returns true', () => {
    const sut = makeSut();
    const isValid = sut.isValid(fakeEmail);

    expect(isValid).toBe(true);
  });

  test('Should call validator with correct email', () => {
    const sut = makeSut();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    sut.isValid(fakeEmail);

    expect(isEmailSpy).toHaveBeenCalledWith(fakeEmail);
  });
});
