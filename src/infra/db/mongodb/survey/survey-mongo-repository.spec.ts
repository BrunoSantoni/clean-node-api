import { Collection } from 'mongodb';
import { mockAddSurveyParams } from '@/domain/test';
import { SurveyMongoRepository } from './survey-mongo-repository';
import { MongoHelper } from './survey-mongo-repository-protocols';

let surveyCollection: Collection;

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository();

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');

    await surveyCollection.deleteMany({});
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
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()];
      await surveyCollection.insertMany(addSurveyModels);

      const sut = makeSut();

      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe(addSurveyModels[0].question);
      expect(surveys[1].question).toBe(addSurveyModels[1].question);
    });

    test('Should load empty list', async () => {
      const sut = makeSut();

      const surveys = await sut.loadAll();

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
