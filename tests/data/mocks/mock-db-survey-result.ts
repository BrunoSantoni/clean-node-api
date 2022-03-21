import { SaveSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols';
import { SurveyResultModel } from '@/domain/models';
import { SaveSurveyResultParams } from '@/domain/usecases';
import { mockSurveyResultModel } from '@/tests/domain/mocks';

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  surveyData: SaveSurveyResultParams;

  async save(surveyData: SaveSurveyResultParams): Promise<void> {
    this.surveyData = surveyData;
    return Promise.resolve();
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyId: string;

  accountId: string;

  surveyResult = mockSurveyResultModel();

  async loadBySurveyId(surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId;
    this.accountId = accountId;

    return Promise.resolve(this.surveyResult);
  }
}
