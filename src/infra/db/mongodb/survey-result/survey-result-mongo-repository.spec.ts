import { Collection, ObjectId } from 'mongodb';
import { SurveyResultMongoRepository } from './survey-result-mongo-repository';
import { AddSurveyParams, MongoHelper, AddAccountParams } from './survey-result-mongo-repository-protocols';

let accountCollection: Collection;
let surveyCollection: Collection;
let surveyResultCollection: Collection;

const makeFakeSurveyData = (prefix = 'any'): AddSurveyParams => ({
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

const makeFakeAccountData = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
});

const makeSut = (): SurveyResultMongoRepository => new SurveyResultMongoRepository();

const makeSurvey = async (): Promise<string> => {
  const { insertedId } = await surveyCollection.insertOne(makeFakeSurveyData());

  return String(insertedId);
};

const makeAccount = async (): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne(makeFakeAccountData());

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
      const survey = makeFakeSurveyData();
      const surveyId = await makeSurvey();
      const accountId = await makeAccount();
      const sut = makeSut();

      const surveyResult = await sut.save({
        surveyId,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.answer).toBe(survey.answers[0].answer);
    });

    test('Should update a survey result if its not new', async () => {
      const survey = makeFakeSurveyData();
      const surveyId = await makeSurvey();
      const accountId = await makeAccount();
      const { insertedId } = await surveyResultCollection.insertOne({
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
      expect(surveyResult.id).toEqual(String(insertedId)); // Garantindo que o save não gerou um registro novo
      expect(surveyResult.answer).toBe(survey.answers[1].answer);
    });
  });
});
