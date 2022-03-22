import { Authentication } from '@/domain/usecases';
import {
  badRequest, serverError, success, unauthorized,
} from '@/presentation/helpers';
import { Validation, Controller, HttpResponse } from '@/presentation/protocols';

export namespace LoginController {
  export type Request = {
    email: string;
    password: string;
  };
}

export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) {}

  async handle(request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate<{ email: string, password: string }>(request);

      if (error) {
        return badRequest(error);
      }

      const { email, password } = request;

      const authenticationModel = await this.authentication.auth({ email, password });

      if (!authenticationModel) {
        return unauthorized();
      }

      return success(authenticationModel);
    } catch (error) {
      return serverError(error);
    }
  }
}
