import { SaveSurveyResultController } from '@/presentation/controllers';
import { Controller } from '@/presentation/protocols';
import { makeDbSaveSurveyResult, makeDbLoadSurveyById } from '@/main/factories/usecases';
import { makeLogControllerDecorator } from '@/main/factories/decorators';

export const makeSaveSurveyResultController = (): Controller => {
  // Data
  const dbLoadSurveyById = makeDbLoadSurveyById();
  const dbSaveSurveyResult = makeDbSaveSurveyResult();

  // Presentation
  const saveSurveyResultController = new SaveSurveyResultController(dbLoadSurveyById, dbSaveSurveyResult);

  // Main
  return makeLogControllerDecorator(saveSurveyResultController);
};
