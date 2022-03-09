import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository';
import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result';
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result';

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  // Infra
  const saveSurveyResultRepository = new SurveyResultMongoRepository();

  // Data
  return new DbSaveSurveyResult(saveSurveyResultRepository);
};
