import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository';
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository';
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository';
import { AccountModel } from '@/domain/models/account';
import { mockAccountModel } from '@/domain/test';
import { AddAccountParams } from '@/domain/usecases/account/add-account';

export class AddAccountRepositorySpy implements AddAccountRepository {
  addAccountParams: AddAccountParams;

  accountModel = mockAccountModel();

  async add(accountData: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = accountData;
    return Promise.resolve(this.accountModel);
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  email: string;

  accountModel = mockAccountModel();

  async loadByEmail(email: string): Promise<AccountModel> {
    this.email = email;
    return Promise.resolve(this.accountModel);
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  token: string;

  role?: string;

  accountModel = mockAccountModel();

  async loadByToken(token: string, role?: string): Promise<AccountModel> {
    this.token = token;
    this.role = role;
    return Promise.resolve(this.accountModel);
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string;

  token: string;

  async updateAccessToken(accountId: string, token: string): Promise<void> {
    this.id = accountId;
    this.token = token;

    return Promise.resolve();
  }
}
