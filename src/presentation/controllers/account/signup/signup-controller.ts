import { AuthenticationModel } from '@/domain/models';
import { EmailInUseError } from '@/presentation/errors';
import {
  badRequest, forbidden, serverError, success,
} from '@/presentation/helpers';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
  Validation,
  CreateAccountParams,
  Authentication,
} from './signup-controller-protocols';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate<CreateAccountParams>(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const {
        name, email, password,
      } = httpRequest.body;

      const account = await this.addAccount.add({ name, email, password });

      if (!account) {
        return forbidden(new EmailInUseError());
      }

      const authenticationModel = await this.authentication.auth({
        email,
        password,
      });

      return success<AuthenticationModel>(authenticationModel);
    } catch (error) {
      return serverError(error);
    }
  }
}
