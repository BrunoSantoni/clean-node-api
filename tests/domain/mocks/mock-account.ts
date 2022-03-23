import faker from '@faker-js/faker';
import { AddAccount, AuthenticationParams } from '@/domain/usecases';
import { AccountModel, AuthenticationModel } from '@/domain/models';

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockAccountModel = (): AccountModel => ({
  id: faker.datatype.uuid(),
  ...mockAddAccountParams(),
});

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockAuthenticationModel = (): AuthenticationModel => ({
  accessToken: faker.datatype.uuid(),
  name: faker.name.findName(),
});
