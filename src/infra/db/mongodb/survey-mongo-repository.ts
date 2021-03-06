import { ObjectId } from 'mongodb';
import {
  AddSurveyRepository,
  CheckSurveyByIdRepository,
  LoadAnswersBySurveyRepository,
  LoadSurveysRepository,
  LoadSurveyByIdRepository,
} from '@/data/protocols/db';
import { MongoHelper, QueryBuilder } from '@/infra/db/mongodb/helpers';

export class SurveyMongoRepository implements
AddSurveyRepository,
CheckSurveyByIdRepository,
LoadAnswersBySurveyRepository,
LoadSurveysRepository,
LoadSurveyByIdRepository {
  async add(surveyData: AddSurveyRepository.Params): Promise<AddSurveyRepository.Result> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  }

  async loadAll(accountId: string): Promise<LoadSurveysRepository.Result> {
    const surveyCollection = MongoHelper.getCollection('surveys');

    const query = new QueryBuilder()
      .lookup({
        from: 'survey_results',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result',
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didUserAnswered: {
          // GTE - Greater than or equal, se for >= 1 é sinal que deu true
          $gte: [{
            $size: {
              $filter: {
                input: '$result', // Array a ser percorrido
                as: 'item', // Nome de cada elemento
                cond: {
                  $eq: ['$$item.accountId', new ObjectId(accountId)],
                },
              },
            },
          }, 1],
        },
      })
      .build();

    const surveys = await surveyCollection.aggregate(query).toArray();

    return MongoHelper.mapCollection(surveys);
  }

  async checkById(id: string): Promise<boolean> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) }, {
      projection: {
        _id: 1,
      },
    });

    return Boolean(survey);
  }

  async loadById(id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    const { _id: mongoId, ...survey } = await surveyCollection.findOne({ _id: new ObjectId(id) }) || {};

    if (!mongoId || !survey) return null;

    const convertedSurvey = survey as Omit<LoadSurveyByIdRepository.Result, 'id'>;

    return MongoHelper.map<Omit<LoadSurveyByIdRepository.Result, 'id'>>(mongoId, convertedSurvey);
  }

  async loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    const surveyCollection = MongoHelper.getCollection('surveys');
    const query = new QueryBuilder()
      .match({
        _id: new ObjectId(id),
      })
      .project({
        _id: 0,
        answers: '$answers.answer',
      })
      .build();

    const surveys = await surveyCollection.aggregate(query).toArray();

    return surveys[0]?.answers || [];
  }
}
