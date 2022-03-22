import { makeSignUpValidation } from './signup-validation-factory';
import { SignUpController } from '@/presentation/controllers';
import { Controller } from '@/presentation/protocols';
import { makeDbAddAccount, makeDbAuthentication } from '@/main/factories/usecases';
import { makeLogControllerDecorator } from '@/main/factories/decorators';

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
