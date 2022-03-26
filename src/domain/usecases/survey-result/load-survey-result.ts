import { SurveyResultModel } from '@/domain/models';

export namespace LoadSurveyResult {
  export type Result = SurveyResultModel;
}

export interface LoadSurveyResult {
  load(surveyId: string, accountId: string): Promise<LoadSurveyResult.Result>;
}
