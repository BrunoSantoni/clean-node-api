import { DbLoadSurveyResult } from '@/data/usecases/survey-result';
import { LoadSurveyResult } from '@/domain/usecases';
import { SurveyMongoRepository, SurveyResultMongoRepository } from '@/infra/db';

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  // Infra
  const surveyRepository = new SurveyMongoRepository();
  const surveyResultRepository = new SurveyResultMongoRepository();

  // Data
  return new DbLoadSurveyResult(surveyResultRepository, surveyRepository);
};
