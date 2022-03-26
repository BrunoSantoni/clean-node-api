import { SurveyResultModel } from '@/domain/models';

export namespace LoadSurveyResultRepository {
  export type Result = SurveyResultModel;
}

export interface LoadSurveyResultRepository {
  loadBySurveyId(surveyId: string, accountId: string): Promise<LoadSurveyResultRepository.Result>;
}
