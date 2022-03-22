import { DbAuthentication } from '@/data/usecases/account';
import { Authentication } from '@/domain/usecases';
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography';
import { AccountMongoRepository } from '@/infra/db';
import { env } from '@/main/config/env';

export const makeDbAuthentication = (): Authentication => {
  // Constructors
  const salt = 12;

  // Infra
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const addAccountRepository = new AccountMongoRepository();

  // Data
  return new DbAuthentication(
    addAccountRepository,
    bcryptAdapter,
    jwtAdapter,
    addAccountRepository,
  );
};
