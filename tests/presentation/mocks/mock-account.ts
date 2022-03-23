import { mockAccountModel, mockAuthenticationModel } from '@/tests/domain/mocks';
import {
  AddAccount, LoadAccountByToken, Authentication, AuthenticationParams,
} from '@/domain/usecases';
import { AccountModel, AuthenticationModel } from '@/domain/models';

export class AddAccountSpy implements AddAccount {
  addAccountParams: AddAccount.Params;

  wasAccountCreated = true;

  async add(account: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = account;
    return Promise.resolve(this.wasAccountCreated);
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
