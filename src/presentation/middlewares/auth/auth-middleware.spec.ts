import { AccountModel, HttpRequest, LoadAccountByToken } from './auth-middleware-protocols';
import { AuthMiddleware } from './auth-middleware';
import { forbidden, serverError, success } from '@/presentation/helpers/http/http-helper';
import { AccessDeniedError } from '@/presentation/errors';
import { throwError } from '@/domain/test';

type SutTypes = {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
};

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email',
  name: 'any_name',
  password: 'any_password',
});

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new LoadAccountByTokenStub();
};

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token',
  },
});

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub, role);

  return {
    sut,
    loadAccountByTokenStub,
  };
};

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token is provided in headers', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role';

    const { sut, loadAccountByTokenStub } = makeSut(role);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(loadSpy).toHaveBeenCalledWith(httpRequest.headers['x-access-token'], role);
  });

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(success({ accountId: 'any_id' }));
  });

  // Teste para colocar o try catch
  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
