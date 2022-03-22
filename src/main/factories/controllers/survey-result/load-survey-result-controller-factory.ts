import { LoadSurveyResultController } from '@/presentation/controllers';
import { Controller } from '@/presentation/protocols';
import { makeDbLoadSurveyResult, makeDbLoadSurveyById } from '@/main/factories/usecases';
import { makeLogControllerDecorator } from '@/main/factories/decorators';

export const makeLoadSurveyResultController = (): Controller => {
  // Data
  const dbLoadSurveyById = makeDbLoadSurveyById();
  const dbLoadSurveyResult = makeDbLoadSurveyResult();

  // Presentation
  const loadSurveyResultController = new LoadSurveyResultController(dbLoadSurveyById, dbLoadSurveyResult);

  // Main
  return makeLogControllerDecorator(loadSurveyResultController);
};
