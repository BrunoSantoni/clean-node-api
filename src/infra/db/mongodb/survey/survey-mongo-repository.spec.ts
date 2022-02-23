import { Collection } from 'mongodb';
import { SurveyMongoRepository } from './survey-mongo-repository';
import { MongoHelper } from '../helpers/mongo-helper';
import { AddSurveyModel } from '../../../../domain/usecases/add-survey';

let surveyCollection: Collection;

const makeFakeSurveyData = (prefix = 'any'): AddSurveyModel => ({
  question: `${prefix}_question`,
  answers: [
    {
      image: `${prefix}_image`,
      answer: `${prefix}_answer`,
    },
    {
      answer: `${prefix}_other_answer`,
    },
  ],
  date: new Date(),
});

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

      await sut.add(makeFakeSurveyData());

      const survey = await surveyCollection.findOne({ question: 'any_question' });

      expect(survey).toBeTruthy();
    });
  });

  describe('loadAll()', () => {
    test('Should load all surveys on success', async () => {
      await surveyCollection.insertMany([makeFakeSurveyData(), makeFakeSurveyData('other')]);

      const sut = makeSut();

      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(2);
      expect(surveys[0].question).toBe('any_question');
      expect(surveys[1].question).toBe('other_question');
    });
  });
});
