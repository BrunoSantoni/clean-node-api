import { SurveyModel } from '@/domain/models';

export namespace LoadSurveyById {
  export type Result = SurveyModel;
}

export interface LoadSurveyById {
  loadById (id: string): Promise<LoadSurveyById.Result>;
}
