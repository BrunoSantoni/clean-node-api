import { AccessDeniedError } from '../../errors';
import { forbidden } from '../../helpers/http/http-helper';
import {
  HttpRequest, HttpResponse, Middleware, LoadAccountByToken,
} from './auth-middleware-protocols';

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token'];
    if (!accessToken) {
      return forbidden(new AccessDeniedError());
    }

    console.log(httpRequest.headers['x-access-token']);

    await this.loadAccountByToken.load(httpRequest.headers['x-access-token']);
  }
}
