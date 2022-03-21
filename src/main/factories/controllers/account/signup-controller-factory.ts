import { makeSignUpValidation } from './signup-validation-factory';
import { SignUpController } from '@/presentation/controllers/account/signup/signup-controller';
import { Controller } from '@/presentation/protocols';
import { makeDbAuthentication } from '@/main/factories/usecases/account/db-authentication-factory';
import { makeDbAddAccount } from '@/main/factories/usecases/account/db-add-account-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';

export const makeSignUpController = (): Controller => {
  // Constructors

  // Infra

  // Data
  const dbAddAccount = makeDbAddAccount();
  const dbAuthentication = makeDbAuthentication();

  // Presentation
  const validationComposite = makeSignUpValidation();

  const signUpController = new SignUpController(
    dbAddAccount,
    validationComposite,
    dbAuthentication,
  );

  // Main
  const logControllerDecorator = makeLogControllerDecorator(signUpController);
  return logControllerDecorator;
};
