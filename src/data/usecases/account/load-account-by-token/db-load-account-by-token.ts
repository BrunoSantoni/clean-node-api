import {
  LoadAccountByToken, AccountModel, Decrypter, LoadAccountByTokenRepository,
} from './db-load-account-by-token-protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    // O jwt retorna uma exceção se possuir um token mas ele for inválido, queremo
    // colocar um catch para retornar null e apresentar 403 no front, e não um erro 500
    let decryptedToken: string;
    try {
      decryptedToken = await this.decrypter.decrypt(accessToken);
    } catch {
      return null;
    }

    if (!decryptedToken) {
      return null;
    }

    const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role);

    return account || null;
  }
}
