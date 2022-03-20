import faker from '@faker-js/faker';
import { InvalidParamError } from '@/presentation/errors';
import { EmailValidatorSpy } from '@/validation/test';
import { EmailValidation } from './email-validation';
import { throwError } from '@/domain/test';

type SutTypes = {
  sut: EmailValidation;
  emailValidatorSpy: EmailValidatorSpy;
};

const field = faker.random.word();

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy();
  const sut = new EmailValidation(field, emailValidatorSpy);

  return {
    sut,
    emailValidatorSpy,
  };
};

describe('Email Validation', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut();
    const email = faker.internet.email();
    emailValidatorSpy.isEmailValid = false;

    const error = sut.validate({ [field]: email });
    expect(error).toEqual(new InvalidParamError(field));
  });

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut();
    const email = faker.internet.email();
    sut.validate({ [field]: email });

    expect(emailValidatorSpy.email).toBe(email);
  });

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorSpy } = makeSut();

    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(throwError);

    // Não quer tratar o erro aqui dentro, só está vendo se vai dar throw
    expect(sut.validate).toThrow();
  });
});
