import { SaveSurveyResult, SaveSurveyResultParams, LoadSurveyResult } from '@/domain/usecases';
import { SurveyResultModel } from '@/domain/models';
import { mockSurveyResultModel } from '@/tests/domain/mocks';

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
