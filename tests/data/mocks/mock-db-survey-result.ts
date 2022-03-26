import { SaveSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols';
import { mockSurveyResultModel } from '@/tests/domain/mocks';

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  surveyData: SaveSurveyResultRepository.Params;

  async save(surveyData: SaveSurveyResultRepository.Params): Promise<SaveSurveyResultRepository.Result> {
    this.surveyData = surveyData;
    return Promise.resolve();
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyId: string;

  accountId: string;

  result = mockSurveyResultModel();

  async loadBySurveyId(surveyId: string, accountId: string): Promise<LoadSurveyResultRepository.Result> {
    this.surveyId = surveyId;
    this.accountId = accountId;

    return Promise.resolve(this.result);
  }
}
