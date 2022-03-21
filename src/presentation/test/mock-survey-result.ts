import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { mockSurveyResultModel } from '@/domain/test';

export class SaveSurveyResultSpy implements SaveSurveyResult {
  data: SaveSurveyResultParams;

  surveyResultModel = mockSurveyResultModel();

  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.data = data;

    return Promise.resolve(this.surveyResultModel);
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyId: string;

  accountId: string;

  surveyResultModel = mockSurveyResultModel();

  async load(surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId;
    this.accountId = accountId;

    return Promise.resolve(this.surveyResultModel);
  }
}
