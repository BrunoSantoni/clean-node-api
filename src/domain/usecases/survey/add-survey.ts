import { SurveyModel } from '@/domain/models';

export type AddSurveyParams = Omit<SurveyModel, 'id' | 'didUserAnswered'>;

export interface AddSurvey {
  add(data: AddSurveyParams): Promise<void>;
}
