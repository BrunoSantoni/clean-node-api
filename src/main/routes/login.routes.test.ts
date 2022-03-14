import { Collection } from 'mongodb';
import request from 'supertest';
import { hash } from 'bcrypt';
import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { app } from '@/main/config/app';

let accountCollection: Collection;
describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('POST /signup', () => {
    test('Should return 200 on POST /signup success', async () => {
      await request(app).post('/api/signup').send({
        name: 'Bruno Santoni',
        email: 'bsantoni98@gmail.com',
        password: '123',
        passwordConfirmation: '123',
      }).expect(200);
    });
  });

  describe('POST /login', () => {
    test('Should return 200 on POST /login success', async () => {
      const hashedPassword = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'Bruno Santoni',
        email: 'bsantoni98@gmail.com',
        password: hashedPassword,
      });

      await request(app).post('/api/login').send({
        email: 'bsantoni98@gmail.com',
        password: '123',
      }).expect(200);
    });

    test('Should return 401 on POST /login success', async () => {
      await request(app).post('/api/login').send({
        email: 'bsantoni98@gmail.com',
        password: '123',
      }).expect(401);
    });
  });
});
