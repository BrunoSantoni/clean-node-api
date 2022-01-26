import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log';
import { SignUpController } from '../../presentation/controllers/signup/signup';
import { Controller } from '../../presentation/protocols';
import { LogControllerDecorator } from '../decorators/log';
import { makeSignUpValidation } from './signup-validation';

export const makeSignUpController = (): Controller => {
  const salt = 12;

  const bcryptAdapter = new BcryptAdapter(salt);

  const addAccountRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository);

  const logMongoRepository = new LogMongoRepository();

  const validationComposite = makeSignUpValidation();

  const signUpController = new SignUpController(
    dbAddAccount,
    validationComposite,
  );
  return new LogControllerDecorator(signUpController, logMongoRepository);
};
