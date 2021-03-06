import { AddAccount, Authentication } from '@/domain/usecases';
import { EmailInUseError } from '@/presentation/errors';
import {
  badRequest, forbidden, serverError, success,
} from '@/presentation/helpers';
import { Controller, HttpResponse, Validation } from '@/presentation/protocols';

export namespace SignUpController {
  export type Request = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  };
}

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) {}

  async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);

      if (error) {
        return badRequest(error);
      }

      const {
        name, email, password,
      } = request;

      const wasAccountCreated = await this.addAccount.add({ name, email, password });

      if (!wasAccountCreated) {
        return forbidden(new EmailInUseError());
      }

      const authenticationModel = await this.authentication.auth({
        email,
        password,
      });

      return success<Authentication.Result>(authenticationModel);
    } catch (error) {
      return serverError(error);
    }
  }
}
