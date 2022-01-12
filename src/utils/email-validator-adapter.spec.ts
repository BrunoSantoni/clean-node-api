import { EmailValidatorAdapter } from './email-validator';

/* Componente wrapper que encapsulará o validator, vai injetar a dependência na
camada de presentation */
describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('invalid_email@mail.com');

    expect(isValid).toBe(false);
  });
});
