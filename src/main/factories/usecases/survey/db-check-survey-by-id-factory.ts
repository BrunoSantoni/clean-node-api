import { DbCheckSurveyById } from '@/data/usecases/survey';
import { CheckSurveyById } from '@/domain/usecases';
import { SurveyMongoRepository } from '@/infra/db';

export const makeDbCheckSurveyById = (): CheckSurveyById => {
  // Infra
  const loadSurveyByIdRepository = new SurveyMongoRepository();

  // Data
  return new DbCheckSurveyById(loadSurveyByIdRepository);
};
