import { SaveSurveyResultController } from '@/presentation/controllers';
import { Controller } from '@/presentation/protocols';
import { makeDbSaveSurveyResult, makeDbLoadAnswersBySurvey } from '@/main/factories/usecases';
import { makeLogControllerDecorator } from '@/main/factories/decorators';

export const makeSaveSurveyResultController = (): Controller => {
  // Data
  const dbLoadAnswersBySurvey = makeDbLoadAnswersBySurvey();
  const dbSaveSurveyResult = makeDbSaveSurveyResult();

  // Presentation
  const saveSurveyResultController = new SaveSurveyResultController(dbLoadAnswersBySurvey, dbSaveSurveyResult);

  // Main
  return makeLogControllerDecorator(saveSurveyResultController);
};
