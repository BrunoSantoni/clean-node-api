import { AccessDeniedError } from '../../errors';
import { forbidden, serverError, success } from '../../helpers/http/http-helper';
import {
  HttpRequest, HttpResponse, Middleware, LoadAccountByToken,
} from './auth-middleware-protocols';

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token'];
      if (!accessToken) {
        return forbidden(new AccessDeniedError());
      }

      const account = await this.loadAccountByToken.load(httpRequest.headers['x-access-token']);

      if (!account) {
        return forbidden(new AccessDeniedError());
      }

      return success({ accountId: account.id });
    } catch (error) {
      return serverError(error);
    }
  }
}
