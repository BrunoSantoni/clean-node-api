import { DbLoadSurveyResult } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result';
import { LoadSurveyResult } from '@/domain/usecases';
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository';
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository';

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  // Infra
  const surveyRepository = new SurveyMongoRepository();
  const surveyResultRepository = new SurveyResultMongoRepository();

  // Data
  return new DbLoadSurveyResult(surveyResultRepository, surveyRepository);
};
