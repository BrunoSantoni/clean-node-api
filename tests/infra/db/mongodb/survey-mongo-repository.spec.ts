import { Collection, ObjectId } from 'mongodb';
import FakeObjectId from 'bson-objectid'; // Gera id's fakes do Mongo
import { SurveyMongoRepository } from '@/infra/db';
import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { mockAddAccountParams, mockAddSurveyParams } from '@/tests/domain/mocks';

let accountCollection: Collection;
let surveyCollection: Collection;
let surveyResultCollection: Collection;

const mockAccountId = async (): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne(mockAddAccountParams());

  return String(insertedId);
};

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository();

describe('Survey Mongo Repository', () => {
  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts');
    surveyCollection = MongoHelper.getCollection('surveys');
    surveyResultCollection = MongoHelper.getCollection('survey_results');

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
      const accountId = await mockAccountId();

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
      const accountId = await mockAccountId();
      const sut = makeSut();

      const surveys = await sut.loadAll(accountId);

      expect(surveys.length).toBe(0);
    });
  });

  describe('checkById()', () => {
    test('Should return true if survey exists', async () => {
      const survey = mockAddSurveyParams();
      const { insertedId } = await surveyCollection.insertOne(survey);

      const sut = makeSut();

      const surveyExists = await sut.checkById(String(insertedId));

      expect(surveyExists).toBe(true);
    });

    test('Should return false if survey is not found', async () => {
      const sut = makeSut();

      const surveyExists = await sut.checkById(String(FakeObjectId()));

      expect(surveyExists).toBe(false);
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

    test('Should return null if survey does not exists', async () => {
      const sut = makeSut();

      const survey = await sut.loadById(String(FakeObjectId()));

      expect(survey).toBeNull();
    });
  });

  describe('loadAnswers()', () => {
    test('Should load survey answers on success', async () => {
      const survey = mockAddSurveyParams();
      const { insertedId } = await surveyCollection.insertOne(survey);

      const sut = makeSut();

      const answers = await sut.loadAnswers(String(insertedId));
      const insertedSurveyAnswers = survey.answers.map((a) => a.answer);

      expect(answers).toEqual(insertedSurveyAnswers);
    });

    test('Should return empty array if survey does not exists', async () => {
      const sut = makeSut();

      const answers = await sut.loadAnswers(String(FakeObjectId()));

      expect(answers).toEqual([]);
    });
  });
});
