import { DbLoadAccountByToken } from '@/data/usecases/account';
import { LoadAccountByToken } from '@/domain/usecases';
import { JwtAdapter } from '@/infra/cryptography';
import { AccountMongoRepository } from '@/infra/db';
import { env } from '@/main/config/env';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  // Infra
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();

  // Data
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};
