import { badRequest, serverError, success } from '../../helpers/http-helper';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddAccount,
  AccountModel,
  Validation,
  CreateAccountParams,
} from './signup-protocols';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
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

      return success<AccountModel>(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
