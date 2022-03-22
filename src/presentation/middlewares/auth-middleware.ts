import { LoadAccountByToken } from '@/domain/usecases';
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden, serverError, success } from '@/presentation/helpers';
import { HttpResponse, Middleware } from '@/presentation/protocols';

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string;
  };
}

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string,
  ) {}

  async handle(request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request;
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
