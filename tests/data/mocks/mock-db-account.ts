import faker from '@faker-js/faker';
import {
  AddAccountRepository, LoadAccountByEmailRepository, LoadAccountByTokenRepository, UpdateAccessTokenRepository,
} from '@/data/protocols';

export class AddAccountRepositorySpy implements AddAccountRepository {
  addAccountParams: AddAccountRepository.Params;

  wasAccountCreated = true;

  async add(accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    this.addAccountParams = accountData;
    return Promise.resolve(this.wasAccountCreated);
  }
}

export class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  email: string;

  result = {
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    password: faker.internet.password(),
  };

  async loadByEmail(email: string): Promise<LoadAccountByEmailRepository.Result> {
    this.email = email;
    return Promise.resolve(this.result);
  }
}

export class LoadAccountByTokenRepositorySpy implements LoadAccountByTokenRepository {
  token: string;

  role?: string;

  result = {
    id: faker.datatype.uuid(),
  };

  async loadByToken(token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
    this.token = token;
    this.role = role;
    return Promise.resolve(this.result);
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
