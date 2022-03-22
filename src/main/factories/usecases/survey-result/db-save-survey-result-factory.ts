import { DbSaveSurveyResult } from '@/data/usecases/survey-result';
import { SaveSurveyResult } from '@/domain/usecases';
import { SurveyResultMongoRepository } from '@/infra/db';

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  // Infra
  const surveyResultRepository = new SurveyResultMongoRepository();

  // Data
  return new DbSaveSurveyResult(surveyResultRepository, surveyResultRepository);
};
