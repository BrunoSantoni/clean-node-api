import { SurveyModel } from '@/domain/models';

export namespace LoadSurveysRepository {
  export type Result = SurveyModel[];
}

export interface LoadSurveysRepository {
  loadAll(accountId: string): Promise<LoadSurveysRepository.Result>;
}
