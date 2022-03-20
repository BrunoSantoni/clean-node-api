import faker from '@faker-js/faker';
import { AccountModel } from '@/domain/models/account';
import { AddAccountParams } from '@/domain/usecases/account/add-account';
import { AuthenticationParams } from '@/domain/usecases/account/authentication';
import { AuthenticationModel } from '@/domain/models/authentication';

export const mockAddAccountParams = (): AddAccountParams => ({
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
