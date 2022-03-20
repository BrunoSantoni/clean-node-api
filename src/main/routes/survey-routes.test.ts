import request from 'supertest';
import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import faker from '@faker-js/faker';
import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { app } from '@/main/config/app';
import { env } from '@/main/config/env';
import { mockAddSurveyParams } from '@/domain/test';

let surveyCollection: Collection;
let accountCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const account = await accountCollection.insertOne({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
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
      const survey = mockAddSurveyParams();
      delete survey.date;

      await request(app).post('/api/surveys').send(survey).expect(403);
    });

    test('Should return 204 on add survey with valid accessToken', async () => {
      const account = await accountCollection.insertOne({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'admin',
      });

      const accessToken = sign({ id: account.insertedId }, env.jwtSecret);
      const survey = mockAddSurveyParams();
      delete survey.date;

      await accountCollection.updateOne({
        _id: account.insertedId,
      }, {
        $set: {
          accessToken,
        },
      });

      await request(app).post('/api/surveys').set('x-access-token', accessToken).send(survey)
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
      await surveyCollection.insertMany([mockAddSurveyParams(), mockAddSurveyParams()]);

      const accessToken = await makeAccessToken();

      await request(app).get('/api/surveys').set('x-access-token', accessToken).send()
        .expect(200);
    });
  });
});
