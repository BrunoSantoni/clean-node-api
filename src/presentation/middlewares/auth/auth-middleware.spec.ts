import { HttpRequest } from './auth-middleware-protocols';
import { AuthMiddleware } from './auth-middleware';
import { forbidden } from '../../helpers/http/http-helper';
import { AccessDeniedError } from '../../errors';

type SutTypes = {
  sut: AuthMiddleware;
};

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token',
  },
});

const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware();

  return {
    sut,
  };
};

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token is provided in headers', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
});
