import { DbAddAccount } from '@/data/usecases/account';
import { AddAccount } from '@/domain/usecases';
import { BcryptAdapter } from '@/infra/cryptography';
import { AccountMongoRepository } from '@/infra/db';

export const makeDbAddAccount = (): AddAccount => {
  // Constructors
  const salt = 12;

  // Infra
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();

  // Data
  return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository);
};
