import { Collection, ObjectId } from 'mongodb';
import faker from '@faker-js/faker';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { MongoHelper } from './survey-result-mongo-repository-protocols';
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test';

let accountCollection: Collection;
let surveyCollection: Collection;
let surveyResultCollection: Collection;

const makeSut = (): SurveyResultMongoRepository => new SurveyResultMongoRepository();

const mockSurvey = async (survey = mockAddSurveyParams()): Promise<string> => {
  const { insertedId } = await surveyCollection.insertOne(survey);

  return String(insertedId);
};

const mockAccount = async (): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne(mockAddAccountParams());

  return String(insertedId);
};

describe('Survey Result Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    surveyCollection = await MongoHelper.getCollection('surveys');
    surveyResultCollection = await MongoHelper.getCollection('survey_results');

    await accountCollection.deleteMany({});
    await surveyCollection.deleteMany({});
    await surveyResultCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const survey = mockAddSurveyParams();
      const surveyId = await mockSurvey(survey);
      const accountId = await mockAccount();
      const sut = makeSut();

      await sut.save({
        surveyId,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId),
      });

      expect(surveyResult).toBeTruthy();
    });

    test('Should update a survey result if its not new', async () => {
      const survey = mockAddSurveyParams();
      const surveyId = await mockSurvey(survey);
      const accountId = await mockAccount();
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId),
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      const sut = makeSut();

      await sut.save({
        surveyId,
        accountId,
        answer: survey.answers[1].answer,
        date: new Date(),
      });

      const surveyResult = await surveyResultCollection.find({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId),
      }).toArray();

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.length).toBe(1);
    });
  });

  describe('loadBySurveyId()', () => {
    test('Should load survey result', async () => {
      const survey = mockAddSurveyParams();
      survey.answers.push({
        answer: faker.random.word(),
      });
      const surveyId = await mockSurvey(survey);
      const firstAccountId = await mockAccount();
      const secondAccountId = await mockAccount();
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(firstAccountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(secondAccountId),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
      ]);
      const sut = makeSut();

      const surveyResult = await sut.loadBySurveyId(surveyId, firstAccountId);

      expect(surveyResult).toBeTruthy();
      expect(String(surveyResult.surveyId)).toEqual(surveyId);
      expect(surveyResult.answers[0].count).toBe(1);
      expect(surveyResult.answers[0].percent).toBe(50);
      expect(surveyResult.answers[0].isUserCurrentAnswer).toBe(true);
      expect(surveyResult.answers[1].count).toBe(1);
      expect(surveyResult.answers[1].percent).toBe(50);
      expect(surveyResult.answers[1].isUserCurrentAnswer).toBe(false);
      expect(surveyResult.answers[2].count).toBe(0);
      expect(surveyResult.answers[2].percent).toBe(0);
      expect(surveyResult.answers[2].isUserCurrentAnswer).toBe(false);
    });

    test('Should load survey result 2', async () => {
      const survey = mockAddSurveyParams();
      survey.answers.push({
        answer: faker.random.word(),
      });
      const surveyId = await mockSurvey(survey);
      const firstAccountId = await mockAccount();
      const secondAccountId = await mockAccount();
      const thirdAccountId = await mockAccount();
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(firstAccountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(secondAccountId),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(thirdAccountId),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
      ]);
      const sut = makeSut();

      const surveyResult = await sut.loadBySurveyId(surveyId, secondAccountId);

      expect(surveyResult).toBeTruthy();
      expect(String(surveyResult.surveyId)).toEqual(surveyId);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(67);
      expect(surveyResult.answers[0].isUserCurrentAnswer).toBe(true);
      expect(surveyResult.answers[1].count).toBe(1);
      expect(surveyResult.answers[1].percent).toBe(33);
      expect(surveyResult.answers[1].isUserCurrentAnswer).toBe(false);
      expect(surveyResult.answers[2].count).toBe(0);
      expect(surveyResult.answers[2].percent).toBe(0);
      expect(surveyResult.answers[2].isUserCurrentAnswer).toBe(false);
    });

    test('Should load empty survey result', async () => {
      const surveyId = await mockSurvey();
      const accountId = await mockAccount(); // Por ser um teste de integração precisa ser um accountId válido
      const sut = makeSut();

      const surveyResult = await sut.loadBySurveyId(surveyId, accountId);

      expect(surveyResult).toBeNull();
    });
  });
});
