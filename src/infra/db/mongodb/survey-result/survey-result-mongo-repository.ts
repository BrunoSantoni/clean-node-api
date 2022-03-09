import { ObjectId } from 'mongodb';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { MongoHelper, SaveSurveyResultRepository } from './survey-result-mongo-repository-protocols';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(surveyData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('survey_results');

    const {
      value: {
        _id: mongoId, surveyId, accountId, answer, date,
      },
    } = await surveyResultCollection.findOneAndUpdate({
      surveyId: new ObjectId(surveyData.surveyId),
      accountId: new ObjectId(surveyData.accountId),
    }, {
      $set: {
        answer: surveyData.answer,
        date: surveyData.date,
      },
    }, {
      upsert: true,
      returnDocument: 'after',
    });

    return {
      id: String(mongoId),
      accountId: String(accountId),
      surveyId: String(surveyId),
      answer,
      date,
    };
  }
}
