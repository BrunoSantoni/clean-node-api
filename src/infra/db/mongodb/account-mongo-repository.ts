import { ObjectId } from 'mongodb';
import {
  AddAccountRepository,
  CheckAccountByEmailRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository,
} from '@/data/protocols/db';
import { MongoHelper } from '@/infra/db/mongodb/helpers';

export class AccountMongoRepository implements
AddAccountRepository,
CheckAccountByEmailRepository,
LoadAccountByEmailRepository,
UpdateAccessTokenRepository,
LoadAccountByTokenRepository {
  async add(accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const { insertedId } = await accountCollection.insertOne({ ...accountData });

    return !!insertedId;
  }

  async checkByEmail(email: string): Promise<boolean> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne(
      {
        email,
      }, {
        projection: {
          _id: 1,
        },
      },
    );

    return Boolean(account);
  }

  async loadByEmail(email: string): Promise<LoadAccountByEmailRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const { _id: mongoId, ...accountInfo } = await accountCollection.findOne(
      {
        email,
      }, {
        projection: {
          _id: 1,
          name: 1,
          password: 1,
        },
      },
    ) || {};

    if (!mongoId || !accountInfo) return null;

    const convertedAccountInfo = accountInfo as Omit<LoadAccountByEmailRepository.Result, 'id'>;

    return MongoHelper.map<Omit<LoadAccountByEmailRepository.Result, 'id'>>(mongoId, convertedAccountInfo);
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.updateOne({ _id: new ObjectId(id) }, {
      $set: {
        accessToken: token,
      },
    });
  }

  async loadByToken(token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const { _id: mongoId, ...accountInfo } = await accountCollection.findOne({
      accessToken: token,
      // Buscar pela role fornecida ou se o usuário tiver a role admin deve acessar sempre
      $or: [{
        role,
      }, {
        role: 'admin',
      }],
    }, {
      projection: { // projection fala os campos que quer retornar
        _id: 1,
      },
    }) || {};

    if (!mongoId || !accountInfo) return null;

    const convertedAccountInfo = accountInfo as Omit<LoadAccountByTokenRepository.Result, 'id'>;

    return MongoHelper.map<Omit<LoadAccountByTokenRepository.Result, 'id'>>(mongoId, convertedAccountInfo);
  }
}
