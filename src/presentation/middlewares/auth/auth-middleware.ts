import { AccessDeniedError } from '@/presentation/errors';
import { forbidden, serverError, success } from '@/presentation/helpers';
import {
  HttpRequest, HttpResponse, Middleware, LoadAccountByToken,
} from './auth-middleware-protocols';

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token'];
      if (!accessToken) {
        return forbidden(new AccessDeniedError());
      }

      const account = await this.loadAccountByToken.load(accessToken, this.role);

      if (!account) {
        return forbidden(new AccessDeniedError());
      }

      return success({ accountId: account.id });
    } catch (error) {
      return serverError(error);
    }
  }
}
