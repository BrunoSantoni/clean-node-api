import request from 'supertest';
import { sign } from 'jsonwebtoken';
import { Collection } from 'mongodb';
import faker from '@faker-js/faker';
import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { app } from '@/main/config/app';
import { env } from '@/main/config/env';
import { mockAddSurveyParams } from '@/tests/domain/mocks';

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

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});

    accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app).put(`/api/surveys/${faker.datatype.uuid()}/results`).send({
        answer: faker.random.word(),
      }).expect(403);
    });

    test('Should return 200 on save survey result with correct accessToken', async () => {
      const survey = mockAddSurveyParams();
      const { insertedId } = await surveyCollection.insertOne(survey);

      const accessToken = await makeAccessToken();
      await request(app)
        .put(`/api/surveys/${insertedId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: survey.answers[0].answer,
        })
        .expect(200);
    });
  });

  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 on load survey result without accessToken', async () => {
      await request(app).get(`/api/surveys/${faker.datatype.uuid()}/results`).expect(403);
    });

    test('Should return 200 on load survey result with correct accessToken', async () => {
      const { insertedId } = await surveyCollection.insertOne(mockAddSurveyParams());

      const accessToken = await makeAccessToken();
      await request(app)
        .get(`/api/surveys/${insertedId}/results`)
        .set('x-access-token', accessToken)
        .expect(200);
    });
  });
});
