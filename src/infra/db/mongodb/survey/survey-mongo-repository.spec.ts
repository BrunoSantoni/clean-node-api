import { Collection, ObjectId } from 'mongodb';
import { SurveyMongoRepository } from './survey-mongo-repository';
import { MongoHelper } from './survey-mongo-repository-protocols';
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test';

let accountCollection: Collection;
let surveyCollection: Collection;
let surveyResultCollection: Collection;

const mockAccount = async (): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne(mockAddAccountParams());

  return String(insertedId);
};

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository();

describe('Survey Mongo Repository', () => {
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    surveyCollection = await MongoHelper.getCollection('surveys');
    surveyResultCollection = await MongoHelper.getCollection('survey_results');

    await accountCollection.deleteMany({});
    await surveyCollection.deleteMany({});
    await surveyResultCollection.deleteMany({});
  });

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut();

      await sut.add(mockAddSurveyParams());

      const count = await surveyCollection.countDocuments();

      expect(count).toBe(1);
    });
  });

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      const accountId = await mockAccount();

      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()];

      const { insertedIds } = await surveyCollection.insertMany(addSurveyModels);

      await surveyResultCollection.insertOne({
        surveyId: insertedIds['0'],
        accountId: new ObjectId(accountId),
        answer: addSurveyModels[0].answers[0].answer,
        date: new Date(),
      });

      const sut = makeSut();

      const surveys = await sut.loadAll(accountId);

      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe(addSurveyModels[0].question);
      expect(surveys[0].didUserAnswered).toBe(true);
      expect(surveys[1].question).toBe(addSurveyModels[1].question);
      expect(surveys[1].didUserAnswered).toBe(false);
    });

    test('Should load empty list', async () => {
      const accountId = await mockAccount();
      const sut = makeSut();

      const surveys = await sut.loadAll(accountId);

      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const survey = mockAddSurveyParams();
      const { insertedId } = await surveyCollection.insertOne(survey);

      const sut = makeSut();

      const returnedSurvey = await sut.loadById(String(insertedId));

      expect(returnedSurvey.id).toBeTruthy();
      expect(returnedSurvey.question).toEqual(survey.question);
      expect(returnedSurvey.answers).toEqual(survey.answers);
    });
  });
});
