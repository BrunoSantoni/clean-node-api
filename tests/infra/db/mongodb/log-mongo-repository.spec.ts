import { Collection } from 'mongodb';
import faker from '@faker-js/faker';
import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { LogMongoRepository } from '@/infra/db';

const makeSut = (): LogMongoRepository => new LogMongoRepository();

describe('Log Mongo Repository', () => {
  let errorCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    errorCollection = MongoHelper.getCollection('errors');
    await errorCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should create an error log on success', async () => {
    const sut = makeSut();
    await sut.logError(faker.random.words());

    const count = await errorCollection.countDocuments();

    expect(count).toBe(1);
  });
});
