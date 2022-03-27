import { Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import request from 'supertest';
import { app } from '@/main/config/app';
import { env } from '@/main/config/env';
import { MongoHelper } from '@/infra/db';

let surveyCollection: Collection;
let accountCollection: Collection;

const mockAccessToken = async (): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne({
    name: 'Bruno Santoni',
    email: 'bsantoni98@gmail.com',
    password: '123',
    role: 'admin',
  });
  const id = insertedId.toHexString();
  const accessToken = sign({ id }, env.jwtSecret);
  await accountCollection.updateOne({
    _id: insertedId,
  }, {
    $set: {
      accessToken,
    },
  });
  return accessToken;
};

describe('SurveyResult GraphQL', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys');
    accountCollection = MongoHelper.getCollection('accounts');
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  describe('SurveyResult Query', () => {
    test('Should return SurveyResult', async () => {
      const accessToken = await mockAccessToken();
      const now = new Date();

      const surveyRes = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com',
        }, {
          answer: 'Answer 2',
        }],
        date: now,
      });

      const query = `query {
        loadSurveyResult (surveyId: "${surveyRes.insertedId.toHexString()}") {
          question
          answers {
            answer
            count
            percent
            isUserCurrentAnswer
          }
          date
        }
      }`;

      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query });

      expect(res.status).toBe(200);
      expect(res.body.data.loadSurveyResult.question).toBe('Question');
      expect(res.body.data.loadSurveyResult.date).toBe(now.toISOString());
      expect(res.body.data.loadSurveyResult.answers).toEqual([{
        answer: 'Answer 1',
        count: 0,
        percent: 0,
        isUserCurrentAnswer: false,
      }, {
        answer: 'Answer 2',
        count: 0,
        percent: 0,
        isUserCurrentAnswer: false,
      }]);
    });

    test('Should return AccessDeniedError if no token is provided', async () => {
      const surveyRes = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com',
        }, {
          answer: 'Answer 2',
        }],
        date: new Date(),
      });

      const query = `query {
        loadSurveyResult (surveyId: "${surveyRes.insertedId.toHexString()}") {
          question
          answers {
            answer
            count
            percent
            isUserCurrentAnswer
          }
          date
        }
      }`;

      const res = await request(app)
        .post('/graphql')
        .send({ query });

      expect(res.status).toBe(403);
      expect(res.body.data).toBeFalsy();
      expect(res.body.errors[0].message).toBe('Access Denied');
    });
  });

  describe('SaveSurveyResult Mutation', () => {
    test('Should return SurveyResult', async () => {
      const accessToken = await mockAccessToken();
      const now = new Date();

      const { insertedId } = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com',
        }, {
          answer: 'Answer 2',
        }],
        date: now,
      });

      const query = `mutation {
        saveSurveyResult (surveyId: "${insertedId.toHexString()}", answer: "Answer 1") {
          question
          answers {
            answer
            count
            percent
            isUserCurrentAnswer
          }
          date
        }
      }`;

      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query });

      expect(res.status).toBe(200);
      expect(res.body.data.saveSurveyResult.question).toBe('Question');
      expect(res.body.data.saveSurveyResult.date).toBe(now.toISOString());
      expect(res.body.data.saveSurveyResult.answers).toEqual([{
        answer: 'Answer 1',
        count: 1,
        percent: 100,
        isUserCurrentAnswer: true,
      }, {
        answer: 'Answer 2',
        count: 0,
        percent: 0,
        isUserCurrentAnswer: false,
      }]);
    });

    test('Should return AccessDeniedError if no token is provided', async () => {
      const surveyRes = await surveyCollection.insertOne({
        question: 'Question',
        answers: [{
          answer: 'Answer 1',
          image: 'http://image-name.com',
        }, {
          answer: 'Answer 2',
        }],
        date: new Date(),
      });

      const query = `mutation {
        saveSurveyResult (surveyId: "${surveyRes.insertedId.toHexString()}", answer: "Answer 1") {
          question
          answers {
            answer
            count
            percent
            isUserCurrentAnswer
          }
          date
        }
      }`;

      const res = await request(app)
        .post('/graphql')
        .send({ query });

      expect(res.status).toBe(403);
      expect(res.body.data).toBeFalsy();
      expect(res.body.errors[0].message).toBe('Access Denied');
    });
  });
});
