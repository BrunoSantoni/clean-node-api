import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository';
import { DbLoadSurveys } from '@/data/usecases/survey/load-surveys/db-load-surveys';
import { LoadSurveys } from '@/domain/usecases';

export const makeDbLoadSurveys = (): LoadSurveys => {
  // Infra
  const loadSurveysRepository = new SurveyMongoRepository();

  // Data
  return new DbLoadSurveys(loadSurveysRepository);
};
