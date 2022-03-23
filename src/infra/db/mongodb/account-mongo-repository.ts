import { ObjectId } from 'mongodb';
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository,
} from '@/data/protocols/db';
import { AccountModel } from '@/domain/models';
import { MongoHelper } from '@/infra/db/mongodb/helpers';

export class AccountMongoRepository implements
AddAccountRepository,
LoadAccountByEmailRepository,
UpdateAccessTokenRepository,
LoadAccountByTokenRepository {
  async add(accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const { insertedId } = await accountCollection.insertOne({ ...accountData });

    return MongoHelper.map<AddAccountRepository.Params>(insertedId, accountData);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const { _id: mongoId, ...accountInfo } = await accountCollection.findOne({ email }) || {};

    if (!mongoId || !accountInfo) return null;

    const convertedAccountInfo = accountInfo as Omit<AccountModel, 'id'>;

    return MongoHelper.map<Omit<AccountModel, 'id'>>(mongoId, convertedAccountInfo);
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.updateOne({ _id: new ObjectId(id) }, {
      $set: {
        accessToken: token,
      },
    });
  }

  async loadByToken(token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const { _id: mongoId, ...accountInfo } = await accountCollection.findOne({
      accessToken: token,
      // Buscar pela role fornecida ou se o usuário tiver a role admin deve acessar sempre
      $or: [{
        role,
      }, {
        role: 'admin',
      }],
    }) || {};

    if (!mongoId || !accountInfo) return null;

    const convertedAccountInfo = accountInfo as Omit<AccountModel, 'id'>;

    return MongoHelper.map<Omit<AccountModel, 'id'>>(mongoId, convertedAccountInfo);
  }
}
