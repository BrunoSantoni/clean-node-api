import { env } from '../../config/env';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { makeLoginValidation } from './login-validation-factory';
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { LoginController } from '../../../presentation/controllers/login/login-controller';
import { Controller } from '../../../presentation/protocols';

export const makeLoginController = (): Controller => {
  // Constructors
  const salt = 12;

  // Infra
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const logMongoRepository = new LogMongoRepository();

  // Data
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  );

  // Presentation
  const validationComposite = makeLoginValidation();
  const loginController = new LoginController(validationComposite, dbAuthentication);

  // Main
  return new LogControllerDecorator(loginController, logMongoRepository);
};
