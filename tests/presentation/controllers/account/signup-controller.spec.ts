import faker from '@faker-js/faker';
import { SignUpController } from '@/presentation/controllers';
import { HttpRequest } from '@/presentation/protocols';
import { throwError } from '@/tests/domain/mocks';
import {
  badRequest, forbidden, serverError, success,
} from '@/presentation/helpers';
import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors';
import { AddAccountSpy, AuthenticationSpy, ValidationSpy } from '@/tests/presentation/mocks';

type SutTypes = {
  sut: SignUpController;
  addAccountSpy: AddAccountSpy;
  validationSpy: ValidationSpy;
  authenticationSpy: AuthenticationSpy;
};

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password();

  return {
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password,
    },
  };
};

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy();
  const addAccountSpy = new AddAccountSpy();
  const validationSpy = new ValidationSpy();

  const sut = new SignUpController(addAccountSpy, validationSpy, authenticationSpy);

  return {
    sut,
    addAccountSpy,
    validationSpy,
    authenticationSpy,
  };
};

const fieldMock = faker.random.word();
const stackMock = faker.random.word();

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut();

    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(addAccountSpy.addAccountParams).toEqual({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut();

    /* Apesar do teste não falhar se der um throw sem resolver a promise,
    fazendo assim torna o teste mais fiel */
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new ServerError(stackMock)));
  });

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut();
    addAccountSpy.accountModel = null;

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut();

    const httpResponse = await sut.handle(mockRequest());
    const { authenticationModel } = authenticationSpy;

    expect(httpResponse).toEqual(success(authenticationModel));
  });

  test('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut();
    const httpRequest = mockRequest();

    await sut.handle(httpRequest);

    expect(validationSpy.data).toEqual(httpRequest.body);
  });

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationSpy } = makeSut();

    validationSpy.error = new MissingParamError(fieldMock);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut();

    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    const { email, password } = httpRequest.body;
    expect(authenticationSpy.authenticationParams).toEqual({
      email,
      password,
    });
  });

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut();
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new ServerError(stackMock)));
  });
});
