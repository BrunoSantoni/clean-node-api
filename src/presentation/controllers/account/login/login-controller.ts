import {
  badRequest, serverError, success, unauthorized,
} from '@/presentation/helpers/http/http-helper';
import {
  Validation, Authentication, Controller, HttpRequest, HttpResponse,
} from './login-controller-protocols';

export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate<{ email: string, password: string }>(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const { email, password } = httpRequest.body;

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
