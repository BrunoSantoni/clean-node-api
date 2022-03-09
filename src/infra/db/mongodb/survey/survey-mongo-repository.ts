import { ObjectId } from 'mongodb';
import {
  AddSurveyRepository,
  LoadSurveysRepository,
  LoadSurveyByIdRepository,
  SurveyModel,
  AddSurveyParams,
  MongoHelper,
} from './survey-mongo-repository-protocols';

export class SurveyMongoRepository implements
AddSurveyRepository,
LoadSurveysRepository,
LoadSurveyByIdRepository {
  async add(surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  }

  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveys = await surveyCollection.find().toArray();

    return MongoHelper.mapCollection(surveys);
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const { _id: mongoId, ...survey } = await surveyCollection.findOne({ _id: new ObjectId(id) });

    if (!mongoId || !survey) return null;

    const convertedSurvey = survey as Omit<SurveyModel, 'id'>;

    return MongoHelper.map<Omit<SurveyModel, 'id'>>(mongoId, convertedSurvey);
  }
}
