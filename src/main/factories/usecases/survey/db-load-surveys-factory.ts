import { DbLoadSurveys } from '@/data/usecases/survey';
import { LoadSurveys } from '@/domain/usecases';
import { SurveyMongoRepository } from '@/infra/db';

export const makeDbLoadSurveys = (): LoadSurveys => {
  // Infra
  const loadSurveysRepository = new SurveyMongoRepository();

  // Data
  return new DbLoadSurveys(loadSurveysRepository);
};
