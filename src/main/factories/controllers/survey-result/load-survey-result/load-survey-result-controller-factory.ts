import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbLoadSurveyResult } from '@/main/factories/usecases/survey-result/load-survey-result/db-load-survey-result-factory';
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-factory';
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller';
import { Controller } from '@/presentation/protocols';

export const makeLoadSurveyResultController = (): Controller => {
  // Data
  const dbLoadSurveyById = makeDbLoadSurveyById();
  const dbLoadSurveyResult = makeDbLoadSurveyResult();

  // Presentation
  const loadSurveyResultController = new LoadSurveyResultController(dbLoadSurveyById, dbLoadSurveyResult);

  // Main
  return makeLogControllerDecorator(loadSurveyResultController);
};
