import {
  LoadAccountByToken, AccountModel, Decrypter, LoadAccountByTokenRepository,
} from './db-load-account-by-token-protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    const decryptedToken = await this.decrypter.decrypt(accessToken);
    if (!decryptedToken) {
      return null;
    }

    await this.loadAccountByTokenRepository.loadByToken(decryptedToken);
    return null;
  }
}
