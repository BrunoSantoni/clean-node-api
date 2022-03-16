import { Collection, ObjectId } from 'mongodb';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { MongoHelper } from './survey-result-mongo-repository-protocols';
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test';

let accountCollection: Collection;
let surveyCollection: Collection;
let surveyResultCollection: Collection;

const makeSut = (): SurveyResultMongoRepository => new SurveyResultMongoRepository();

const makeSurvey = async (survey = mockAddSurveyParams()): Promise<string> => {
  const { insertedId } = await surveyCollection.insertOne(survey);

  return String(insertedId);
};

const makeAccount = async (): Promise<string> => {
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
      survey.answers.push({
        answer: 'other_answer',
      });
      const surveyId = await makeSurvey(survey);
      const accountId = await makeAccount();
      const sut = makeSut();

      const surveyResult = await sut.save({
        surveyId,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      expect(surveyResult).toBeTruthy();
      expect(String(surveyResult.surveyId)).toEqual(surveyId);
      expect(surveyResult.answers[0].answer).toBe(survey.answers[0].answer);
      expect(surveyResult.answers[0].count).toBe(1);
      expect(surveyResult.answers[0].percent).toBe(100);
      expect(surveyResult.answers[1].count).toBe(0);
      expect(surveyResult.answers[1].percent).toBe(0);
    });

    test('Should update a survey result if its not new', async () => {
      const survey = mockAddSurveyParams();
      survey.answers.push({
        answer: 'other_answer',
      });
      const surveyId = await makeSurvey(survey);
      const accountId = await makeAccount();
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId),
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      const sut = makeSut();

      const surveyResult = await sut.save({
        surveyId,
        accountId,
        answer: survey.answers[1].answer,
        date: new Date(),
      });

      expect(surveyResult).toBeTruthy();
      expect(String(surveyResult.surveyId)).toEqual(String(surveyId));
      expect(surveyResult.answers[0].answer).toBe(survey.answers[1].answer);
      expect(surveyResult.answers[0].count).toBe(1); // A primeira resposta é sempre a maior
      expect(surveyResult.answers[0].percent).toBe(100);
      expect(surveyResult.answers[1].count).toBe(0);
      expect(surveyResult.answers[1].percent).toBe(0);
    });
  });

  describe('loadBySurveyId()', () => {
    test('Should load survey result', async () => {
      const survey = mockAddSurveyParams();
      survey.answers.push({
        answer: 'other_answer',
      }, {
        answer: 'third_answer',
      });
      const surveyId = await makeSurvey(survey);
      const accountId = await makeAccount();
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          surveyId: new ObjectId(surveyId),
          accountId: new ObjectId(accountId),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
      ]);
      const sut = makeSut();

      const surveyResult = await sut.loadBySurveyId(surveyId);

      expect(surveyResult).toBeTruthy();
      expect(String(surveyResult.surveyId)).toEqual(surveyId);
      expect(surveyResult.answers[0].count).toBe(3);
      expect(surveyResult.answers[0].percent).toBe(75);
      expect(surveyResult.answers[1].count).toBe(1);
      expect(surveyResult.answers[1].percent).toBe(25);
      expect(surveyResult.answers[2].count).toBe(0);
      expect(surveyResult.answers[2].percent).toBe(0);
    });

    test('Should load empty survey result', async () => {
      const surveyId = await makeSurvey();
      const sut = makeSut();

      const surveyResult = await sut.loadBySurveyId(surveyId);

      expect(surveyResult).toBeNull();
    });
  });
});
