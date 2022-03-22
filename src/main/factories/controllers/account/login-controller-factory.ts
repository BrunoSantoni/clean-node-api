import { makeLoginValidation } from './login-validation-factory';
import { LoginController } from '@/presentation/controllers';
import { Controller } from '@/presentation/protocols';
import { makeDbAuthentication } from '@/main/factories/usecases';
import { makeLogControllerDecorator } from '@/main/factories/decorators';

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
