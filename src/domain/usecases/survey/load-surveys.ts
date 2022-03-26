import { SurveyModel } from '@/domain/models';

export namespace LoadSurveys {
  export type Result = SurveyModel[];
}

export interface LoadSurveys {
  load(accountId: string): Promise<LoadSurveys.Result>;
}
