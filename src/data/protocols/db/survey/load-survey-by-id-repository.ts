import { SurveyModel } from '@/domain/models';

export namespace LoadSurveyByIdRepository {
  export type Result = SurveyModel;
}

export interface LoadSurveyByIdRepository {
  loadById(id: string): Promise<LoadSurveyByIdRepository.Result>;
}
