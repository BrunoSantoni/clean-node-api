import { AddSurvey } from '@/domain/usecases';

export namespace AddSurveyRepository {
  export type Params = AddSurvey.Params;
  export type Result = void;
}

export interface AddSurveyRepository {
  add(surveyData: AddSurveyRepository.Params): Promise<AddSurveyRepository.Result>;
}
