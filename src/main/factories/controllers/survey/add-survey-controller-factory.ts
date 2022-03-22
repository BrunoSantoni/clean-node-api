import { makeAddSurveyValidation } from './add-survey-validation-factory';
import { AddSurveyController } from '@/presentation/controllers';
import { Controller } from '@/presentation/protocols';
import { makeDbAddSurvey } from '@/main/factories/usecases';
import { makeLogControllerDecorator } from '@/main/factories/decorators';

export const makeAddSurveyController = (): Controller => {
  // Data
  const dbAddSurvey = makeDbAddSurvey();

  // Presentation
  const validationComposite = makeAddSurveyValidation();
  const addSurveyController = new AddSurveyController(validationComposite, dbAddSurvey);

  // Main
  return makeLogControllerDecorator(addSurveyController);
};
