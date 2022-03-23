import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '@/data/protocols/db';
import { Encrypter, HashComparer } from '@/data/protocols/cryptography';
import { Authentication } from '@/domain/usecases';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {}

  async auth(authenticationParams: Authentication.Params): Promise<Authentication.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authenticationParams.email);

    if (!account) return null;

    const isPasswordValid = await this.hashComparer.compare(
      authenticationParams.password,
      account.password,
    );

    if (!isPasswordValid) return null;

    const accessToken = await this.encrypter.encrypt(account.id);

    await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken);

    return {
      accessToken,
      name: account.name,
    };
  }
}
