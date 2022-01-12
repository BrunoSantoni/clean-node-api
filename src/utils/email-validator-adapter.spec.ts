import validator from 'validator';
import { EmailValidatorAdapter } from './email-validator';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

/* Componente wrapper que encapsulará o validator, vai injetar a dependência na
camada de presentation */
describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    // No teste unitário não quer saber como validar um email
    const isValid = sut.isValid('invalid_email@mail.com');

    expect(isValid).toBe(false);
  });

  test('Should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('valid_email@mail.com');

    expect(isValid).toBe(true);
  });
});
