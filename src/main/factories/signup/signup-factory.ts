import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { makeSignUpValidation } from './signup-validation-factory';
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller';
import { Controller } from '../../../presentation/protocols';

export const makeSignUpController = (): Controller => {
  // Constructors
  const salt = 12;

  // Infra
  const bcryptAdapter = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMongoRepository();
  const logMongoRepository = new LogMongoRepository();

  // Data
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository);

  // Presentation
  const validationComposite = makeSignUpValidation();

  const signUpController = new SignUpController(
    dbAddAccount,
    validationComposite,
  );

  // Main
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
