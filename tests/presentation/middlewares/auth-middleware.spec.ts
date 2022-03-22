import faker from '@faker-js/faker';
import { HttpRequest } from '@/presentation/protocols';
import { AuthMiddleware } from '@/presentation/middlewares';
import { throwError } from '@/tests/domain/mocks';
import { forbidden, serverError, success } from '@/presentation/helpers';
import { AccessDeniedError } from '@/presentation/errors';
import { LoadAccountByTokenSpy } from '@/tests/presentation/mocks';

type SutTypes = {
  sut: AuthMiddleware;
  loadAccountByTokenSpy: LoadAccountByTokenSpy;
};

const mockRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': faker.datatype.uuid(),
  },
});

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy();
  const sut = new AuthMiddleware(loadAccountByTokenSpy, role);

  return {
    sut,
    loadAccountByTokenSpy,
  };
};

const role = faker.random.word();

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token is provided in headers', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut(role);

    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(loadAccountByTokenSpy.token).toBe(httpRequest.headers['x-access-token']);
    expect(loadAccountByTokenSpy.role).toBe(role);
  });

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    loadAccountByTokenSpy.accountModel = null;

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();

    const httpRequest = mockRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(success({ accountId: loadAccountByTokenSpy.accountModel.id }));
  });

  // Teste para colocar o try catch
  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    jest.spyOn(loadAccountByTokenSpy, 'load').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});