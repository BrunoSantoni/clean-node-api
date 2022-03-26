import { SaveSurveyResult, LoadSurveyResult } from '@/domain/usecases';
import { mockSurveyResultModel } from '@/tests/domain/mocks';

export class SaveSurveyResultSpy implements SaveSurveyResult {
  data: SaveSurveyResult.Params;

  result = mockSurveyResultModel();

  async save(data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    this.data = data;

    return Promise.resolve(this.result);
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyId: string;

  accountId: string;

  result = mockSurveyResultModel();

  async load(surveyId: string, accountId: string): Promise<LoadSurveyResult.Result> {
    this.surveyId = surveyId;
    this.accountId = accountId;

    return Promise.resolve(this.result);
  }
}
