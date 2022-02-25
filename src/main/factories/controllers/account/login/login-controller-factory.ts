import { makeLoginValidation } from './login-validation-factory';
import { LoginController } from '@/presentation/controllers/account/login/login-controller';
import { Controller } from '@/presentation/protocols';
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';

export const makeLoginController = (): Controller => {
  // Infra

  // Data
  const dbAuthentication = makeDbAuthentication();

  // Presentation
  const validationComposite = makeLoginValidation();
  const loginController = new LoginController(validationComposite, dbAuthentication);

  // Main
  const logControllerDecorator = makeLogControllerDecorator(loginController);
  return logControllerDecorator;
};
