import faker from '@faker-js/faker';
import { mockAuthenticationModel } from '@/tests/domain/mocks';
import { AddAccount, LoadAccountByToken, Authentication } from '@/domain/usecases';

export class AddAccountSpy implements AddAccount {
  addAccountParams: AddAccount.Params;

  wasAccountCreated = true;

  async add(account: AddAccount.Params): Promise<AddAccount.Result> {
    this.addAccountParams = account;
    return Promise.resolve(this.wasAccountCreated);
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: Authentication.Params;

  authenticationModel = mockAuthenticationModel();

  async auth(authenticationParams: Authentication.Params): Promise<Authentication.Result> {
    this.authenticationParams = authenticationParams;
    return Promise.resolve(this.authenticationModel);
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  token: string;

  role?: string;

  result = {
    id: faker.datatype.uuid(),
  };

  async load(accessToken: string, role?: string): Promise<LoadAccountByToken.Result> {
    this.token = accessToken;
    this.role = role;

    return Promise.resolve(this.result);
  }
}
