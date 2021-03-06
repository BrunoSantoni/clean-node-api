import faker from '@faker-js/faker';
import { LoginController } from '@/presentation/controllers';
import { throwError } from '@/tests/domain/mocks';
import { ServerError } from '@/presentation/errors';
import {
  badRequest, serverError, success, unauthorized,
} from '@/presentation/helpers';
import { AuthenticationSpy, ValidationSpy } from '@/tests/presentation/mocks';

type SutTypes = {
  sut: LoginController;
  validationSpy: ValidationSpy;
  authenticationSpy: AuthenticationSpy;
};

const mockRequest = (): LoginController.Request => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const authenticationSpy = new AuthenticationSpy();
  const sut = new LoginController(validationSpy, authenticationSpy);

  return {
    sut,
    validationSpy,
    authenticationSpy,
  };
};

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut();

    const request = mockRequest();
    await sut.handle(request);

    expect(authenticationSpy.authenticationParams).toEqual(request);
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    authenticationSpy.authenticationModel = null;

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(unauthorized());
  });

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut();
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new ServerError(faker.random.word())));
  });

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();

    const httpResponse = await sut.handle(mockRequest());
    const { authenticationModel } = authenticationSpy;

    expect(httpResponse).toEqual(success(authenticationModel));
  });

  test('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut();
    const request = mockRequest();

    await sut.handle(request);

    expect(validationSpy.data).toEqual(request);
  });

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationSpy } = makeSut();

    validationSpy.error = new Error();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });
});
