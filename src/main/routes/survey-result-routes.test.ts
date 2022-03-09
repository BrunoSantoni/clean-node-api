import request from 'supertest';
import { sign } from 'jsonwebtoken';
import { Collection } from 'mongodb';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { app } from '@/main/config/app';
import { env } from '@/main/config/env';

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

describe('Survey Result Routes', () => {
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

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app).put('/api/surveys/any_id/results').send({
        answer: 'any_answer',
      }).expect(403);
    });

    test('Should return 200 on save survey result with correct accessToken', async () => {
      const { insertedId } = await surveyCollection.insertOne({
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
      });

      const accessToken = await makeAccessToken();
      await request(app)
        .put(`/api/surveys/${insertedId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any_other_answer',
        })
        .expect(200);
    });
  });
});
