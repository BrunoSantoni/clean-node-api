import faker from '@faker-js/faker';
import { AddAccount, Authentication } from '@/domain/usecases';
import { AccountModel } from '@/domain/models';

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockAccountModel = (): AccountModel => ({
  id: faker.datatype.uuid(),
  ...mockAddAccountParams(),
});

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockAuthenticationModel = (): Authentication.Result => ({
  accessToken: faker.datatype.uuid(),
  name: faker.name.findName(),
});
