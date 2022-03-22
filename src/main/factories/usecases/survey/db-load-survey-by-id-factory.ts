import { DbLoadSurveyById } from '@/data/usecases/survey';
import { LoadSurveyById } from '@/domain/usecases';
import { SurveyMongoRepository } from '@/infra/db';

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  // Infra
  const loadSurveyByIdRepository = new SurveyMongoRepository();

  // Data
  return new DbLoadSurveyById(loadSurveyByIdRepository);
};
