import { LoadSurveyResultController } from '@/presentation/controllers';
import { Controller } from '@/presentation/protocols';
import { makeDbLoadSurveyResult, makeDbCheckSurveyById } from '@/main/factories/usecases';
import { makeLogControllerDecorator } from '@/main/factories/decorators';

export const makeLoadSurveyResultController = (): Controller => {
  // Data
  const dbCheckSurveyById = makeDbCheckSurveyById();
  const dbLoadSurveyResult = makeDbLoadSurveyResult();

  // Presentation
  const loadSurveyResultController = new LoadSurveyResultController(dbCheckSurveyById, dbLoadSurveyResult);

  // Main
  return makeLogControllerDecorator(loadSurveyResultController);
};
