import { Collection } from 'mongodb';
import { SurveyMongoRepository } from './survey-mongo-repository';
import { MongoHelper } from '../helpers/mongo-helper';
import { AddSurveyModel } from '../../../../domain/usecases/add-survey';

let surveyCollection: Collection;

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');

    await surveyCollection.deleteMany({});
  });

  const makeFakeSurveyData = (): AddSurveyModel => ({
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

  const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository();

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should add a survey on success', async () => {
    const sut = makeSut();

    await sut.add(makeFakeSurveyData());

    const survey = await surveyCollection.findOne({ question: 'any_question' });

    expect(survey).toBeTruthy();
  });
});
