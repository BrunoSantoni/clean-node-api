import faker from '@faker-js/faker';
import { mockAccountModel, mockAuthenticationModel } from '@/domain/test';
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account';
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token';
import { AccountModel } from '@/domain/models/account';
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication';
import { AuthenticationModel } from '@/domain/models/authentication';

export class AddAccountSpy implements AddAccount {
  addAccountParams: AddAccountParams;

  accountModel = mockAccountModel();

  async add(account: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = account;
    return Promise.resolve(this.accountModel);
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams;

  authenticationModel = mockAuthenticationModel();

  async auth(authenticationParams: AuthenticationParams): Promise<AuthenticationModel> {
    this.authenticationParams = authenticationParams;
    return Promise.resolve(this.authenticationModel);
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  token: string;

  role?: string;

  accountModel = mockAccountModel();

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    this.token = accessToken;
    this.role = role;

    return Promise.resolve(this.accountModel);
  }
}
