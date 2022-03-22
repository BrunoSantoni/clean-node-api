import { LoadSurveysController } from '@/presentation/controllers';
import { Controller } from '@/presentation/protocols';
import { makeDbLoadSurveys } from '@/main/factories/usecases';
import { makeLogControllerDecorator } from '@/main/factories/decorators';

export const makeLoadSurveysController = (): Controller => {
  // Presentation
  const loadSurveysController = new LoadSurveysController(makeDbLoadSurveys());

  // Main
  return makeLogControllerDecorator(loadSurveysController);
};
