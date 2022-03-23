import {
  AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository,
} from '@/data/protocols';
import { AccountModel } from '@/domain/models';
import { mockAccountModel } from '@/tests/domain/mocks';

export class AddAccountRepositorySpy implements AddAccountRepository {
  addAccountParams: AddAccountRepository.Params;

  accountModel = mockAccountModel();

  async add(accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
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
