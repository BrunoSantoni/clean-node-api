import request from 'supertest';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import { app } from '../config/app';
import { env } from '../config/env';

let surveyCollection: Collection;
let accountCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const account = await accountCollection.insertOne({
    name: 'Bruno',
    email: 'brunosantoni98@gmail.com',
    password: 'bruno123',
  });

  const accessToken = sign({ id: account.insertedId }, env.jwtSecret);

  await accountCollection.updateOne({
    _id: account.insertedId,
  }, {
    $set: {
      accessToken,
    },
  });

  return accessToken;
};

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});

    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app).post('/api/surveys').send({
        question: 'Question',
        answers: [
          {
            image: 'http://image-name.com',
            answer: 'Answer 1',
          },
          {
            answer: 'Answer 2',
          },
        ],
      }).expect(403);
    });

    test('Should return 204 on add survey with valid accessToken', async () => {
      const account = await accountCollection.insertOne({
        name: 'Bruno',
        email: 'brunosantoni98@gmail.com',
        password: 'bruno123',
        role: 'admin',
      });

      const accessToken = sign({ id: account.insertedId }, env.jwtSecret);

      await accountCollection.updateOne({
        _id: account.insertedId,
      }, {
        $set: {
          accessToken,
        },
      });

      await request(app).post('/api/surveys').set('x-access-token', accessToken).send({
        question: 'Question',
        answers: [
          {
            image: 'http://image-name.com',
            answer: 'Answer 1',
          },
          {
            answer: 'Answer 2',
          },
        ],
      })
        .expect(204);
    });
  });

  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app).get('/api/surveys').send().expect(403);
    });

    test('should return 204 if no surveys are found', async () => {
      const accessToken = await makeAccessToken();
      await request(app).get('/api/surveys').set('x-access-token', accessToken).send()
        .expect(204);
    });

    test('should return 200 on load surveys with valid accessToken', async () => {
      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer',
          },
          {
            answer: 'any_other_answer',
          },
        ],
        date: new Date(),
      }]);

      const accessToken = await makeAccessToken();

      await request(app).get('/api/surveys').set('x-access-token', accessToken).send()
        .expect(200);
    });
  });
});
