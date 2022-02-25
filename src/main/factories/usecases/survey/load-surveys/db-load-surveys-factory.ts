import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository';
import { DbLoadSurveys } from '@/data/usecases/load-surveys/db-load-surveys';
import { LoadSurveys } from '@/domain/usecases/load-surveys';

export const makeDbLoadSurveys = (): LoadSurveys => {
  // Infra
  const loadSurveysRepository = new SurveyMongoRepository();

  // Data
  return new DbLoadSurveys(loadSurveysRepository);
};