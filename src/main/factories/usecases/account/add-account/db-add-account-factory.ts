import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { DbAddAccount } from '@/data/usecases/add-account/db-add-account';
import { AddAccount } from '@/domain/usecases/add-account';

export const makeDbAddAccount = (): AddAccount => {
  // Constructors
  const salt = 12;

  // Infra
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();

  // Data
  return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository);
};
