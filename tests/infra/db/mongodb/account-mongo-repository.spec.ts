/*
Teste de integração
*/

import { Collection } from 'mongodb';
import faker from '@faker-js/faker';
import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { AccountMongoRepository } from '@/infra/db';
import { mockAddAccountParams } from '@/tests/domain/mocks';

let accountCollection: Collection;

describe(('Account Mongo Repository'), () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    // Limpando a tabela antes dos outros testes
    accountCollection = MongoHelper.getCollection('accounts');

    // Se passar com um objeto vazio, deleta todos os registros
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  const makeSut = (): AccountMongoRepository => new AccountMongoRepository();

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();
      const wasAccountCreated = await sut.add(addAccountParams);

      expect(wasAccountCreated).toBe(true);
    });
  });

  describe('checkByEmail()', () => {
    test('Should return true on checkByEmail success', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();
      await accountCollection.insertOne(addAccountParams);

      const accountAlreadyExists = await sut.checkByEmail(addAccountParams.email);

      expect(accountAlreadyExists).toBe(true);
    });

    test('Should return false if checkByEmail doesnt find an account with given email', async () => {
      const sut = makeSut();

      const account = await sut.checkByEmail(faker.internet.email());

      expect(account).toBe(false);
    });
  });

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();
      await accountCollection.insertOne(addAccountParams);

      const account = await sut.loadByEmail(addAccountParams.email);

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(addAccountParams.name);
      expect(account.password).toBe(addAccountParams.password);
    });

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut();

      const account = await sut.loadByEmail(faker.internet.email());

      expect(account).toBeNull();
    });
  });

  describe('updateAccessToken()', () => {
    let accessToken: string;

    beforeEach(() => {
      accessToken = faker.datatype.uuid();
    });
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();

      const { insertedId } = await accountCollection.insertOne(mockAddAccountParams());

      await sut.updateAccessToken(String(insertedId), accessToken);

      const account = await accountCollection.findOne({ _id: insertedId });

      expect(account).toBeTruthy();
      expect(account.accessToken).toBe(accessToken);
    });
  });

  describe('loadByToken()', () => {
    let accessToken: string;

    beforeEach(() => {
      accessToken = faker.datatype.uuid();
    });

    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();

      await accountCollection.insertOne({
        ...addAccountParams,
        accessToken,
      });

      const account = await sut.loadByToken(accessToken);
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
    });

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();

      await accountCollection.insertOne({
        ...addAccountParams,
        accessToken,
        role: 'admin',
      });

      const account = await sut.loadByToken(accessToken, 'admin');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
    });

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();

      await accountCollection.insertOne({
        ...addAccountParams,
        accessToken,
      });

      const account = await sut.loadByToken(accessToken, 'admin');
      expect(account).toBeFalsy();
    });

    test('Should return an account on loadByToken with if user is admin', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();

      await accountCollection.insertOne({
        ...addAccountParams,
        accessToken,
        role: 'admin',
      });

      const account = await sut.loadByToken(accessToken);
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
    });

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByToken(accessToken);
      expect(account).toBeFalsy();
    });
  });
});
