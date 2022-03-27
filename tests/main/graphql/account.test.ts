import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
import request from 'supertest';
import { Express } from 'express';
import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { setupApp } from '@/main/config/app';

let accountCollection: Collection;
let app: Express;

describe('Account GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp();
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('SignUp Mutation', () => {
    const query = `mutation {
      signUp (name: "Bruno Santoni", email: "bsantoni98@gmail.com", password: "123", passwordConfirmation: "123") {
        accessToken
        name
      }
    }`;

    test('Should return an Account on valid data', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query });
      expect(res.status).toBe(200);
      expect(res.body.data.signUp.accessToken).toBeTruthy();
      expect(res.body.data.signUp.name).toBe('Bruno Santoni');
    });

    test('Should return EmailInUseError on invalid data', async () => {
      const password = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'Bruno Santoni',
        email: 'bsantoni98@gmail.com',
        password,
      });
      const res = await request(app)
        .post('/graphql')
        .send({ query });
      expect(res.status).toBe(403);
      expect(res.body.data).toBeFalsy();
      expect(res.body.errors[0].message).toBe('The received email is already in use');
    });
  });

  describe('Login Query', () => {
    const query = `query {
      login (email: "bsantoni98@gmail.com", password: "123") {
        accessToken
        name
      }
    }`;
    test('Should return an Account on valid credentials', async () => {
      const hashedPassword = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'Bruno Santoni',
        email: 'bsantoni98@gmail.com',
        password: hashedPassword,
      });

      const res = await request(app)
        .post('/graphql')
        .send({ query });
      expect(res.status).toBe(200);
      expect(res.body.data.login.accessToken).toBeTruthy();
      expect(res.body.data.login.name).toBe('Bruno Santoni');
    });

    test('Should return UnauthorizedError on invalid credentials', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query });
      expect(res.status).toBe(401);
      expect(res.body.data).toBeFalsy();
      expect(res.body.errors[0].message).toBe('Unauthorized');
    });
  });
});
