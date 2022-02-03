import { ObjectId } from 'mongodb';
import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository';
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements
AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const { insertedId } = await accountCollection.insertOne({ ...accountData });

    return MongoHelper.map<AddAccountModel>(insertedId, accountData);
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
}