/*
Teste de integração
*/

import { Collection } from 'mongodb';
import { MongoHelper } from './account-mongo-repository-protocols';
import { AccountMongoRepository } from './account-mongo-repository';
import { mockAddAccountParams } from '@/domain/test';

let accountCollection: Collection;

describe(('Account Mongo Repository'), () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    // Limpando a tabela antes dos outros testes
    accountCollection = await MongoHelper.getCollection('accounts');

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
      const httpRequest = mockAddAccountParams();
      const account = await sut.add(httpRequest);

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(httpRequest.name);
      expect(account.email).toBe(httpRequest.email);
      expect(account.password).toBe(httpRequest.password);
    });
  });

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut();
      const httpRequest = mockAddAccountParams();
      await accountCollection.insertOne(httpRequest);

      const account = await sut.loadByEmail(httpRequest.email);

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(httpRequest.name);
      expect(account.email).toBe(httpRequest.email);
      expect(account.password).toBe(httpRequest.password);
    });

    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut();

      const account = await sut.loadByEmail('any_email@mail.com');

      expect(account).toBeFalsy();
    });
  });

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();

      const { insertedId } = await accountCollection.insertOne(mockAddAccountParams());

      await sut.updateAccessToken(String(insertedId), 'any_token');

      const account = await accountCollection.findOne({ _id: insertedId });

      expect(account).toBeTruthy();
      expect(account.accessToken).toBe('any_token');
    });
  });

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut();
      const httpRequest = mockAddAccountParams();

      await accountCollection.insertOne({
        ...httpRequest,
        accessToken: 'any_token',
      });

      const account = await sut.loadByToken('any_token');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(httpRequest.name);
      expect(account.email).toBe(httpRequest.email);
      expect(account.password).toBe(httpRequest.password);
    });

    test('Should return an account on loadByToken with admin role', async () => {
      const sut = makeSut();
      const httpRequest = mockAddAccountParams();

      await accountCollection.insertOne({
        ...httpRequest,
        accessToken: 'any_token',
        role: 'admin',
      });

      const account = await sut.loadByToken('any_token', 'admin');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(httpRequest.name);
      expect(account.email).toBe(httpRequest.email);
      expect(account.password).toBe(httpRequest.password);
    });

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut();
      const httpRequest = mockAddAccountParams();

      await accountCollection.insertOne({
        ...httpRequest,
        accessToken: 'any_token',
      });

      const account = await sut.loadByToken('any_token', 'admin');
      expect(account).toBeFalsy();
    });

    test('Should return an account on loadByToken with if user is admin', async () => {
      const sut = makeSut();
      const httpRequest = mockAddAccountParams();

      await accountCollection.insertOne({
        ...httpRequest,
        accessToken: 'any_token',
        role: 'admin',
      });

      const account = await sut.loadByToken('any_token');
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(httpRequest.name);
      expect(account.email).toBe(httpRequest.email);
      expect(account.password).toBe(httpRequest.password);
    });

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByToken('any_token');
      expect(account).toBeFalsy();
    });
  });
});
