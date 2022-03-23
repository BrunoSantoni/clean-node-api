import { SurveyModel } from '@/domain/models';

export namespace AddSurvey {
  export type Params = Omit<SurveyModel, 'id' | 'didUserAnswered'>;
  export type Result = void;
}

export interface AddSurvey {
  add(data: AddSurvey.Params): Promise<AddSurvey.Result>;
}
