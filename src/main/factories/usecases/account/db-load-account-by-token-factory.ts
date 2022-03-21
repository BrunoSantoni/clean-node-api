import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository';
import { DbLoadAccountByToken } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token';
import { LoadAccountByToken } from '@/domain/usecases';
import { env } from '@/main/config/env';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  // Infra
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();

  // Data
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};
