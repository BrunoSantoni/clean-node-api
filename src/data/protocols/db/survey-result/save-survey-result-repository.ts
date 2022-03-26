import { SaveSurveyResult } from '@/domain/usecases';

export namespace SaveSurveyResultRepository {
  export type Params = SaveSurveyResult.Params;
  export type Result = void;
}

export interface SaveSurveyResultRepository {
  save(surveyData: SaveSurveyResultRepository.Params): Promise<SaveSurveyResultRepository.Result>;
}
