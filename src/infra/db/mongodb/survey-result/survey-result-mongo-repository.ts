import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultModel } from "@/domain/usecases/save-survey-result";
import { ObjectId } from "mongodb";
import { MongoHelper, SaveSurveyResultRepository } from "./survey-result-mongo-repository-protocols";

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(surveyData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('survey_results');

    const { value: { _id: mongoId, surveyId, accountId, answer, date } } = await surveyResultCollection.findOneAndUpdate({
      surveyId: new ObjectId(surveyData.surveyId),
      accountId: new ObjectId(surveyData.accountId),
    }, {
      $set: {
        answer: surveyData.answer,
        date: surveyData.date,
      }
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