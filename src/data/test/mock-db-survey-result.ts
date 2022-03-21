import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import { SurveyResultModel } from '@/domain/models/survey-result';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { mockSurveyResultModel } from '@/domain/test';

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
