import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller';
import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { makeDbAddSurvey } from '@/main/factories/usecases/survey/add-survey/db-add-survey-factory';
import { makeAddSurveyValidation } from './add-survey-validation-factory';

export const makeAddSurveyController = (): Controller => {
  // Data
  const dbAddSurvey = makeDbAddSurvey();

  // Presentation
  const validationComposite = makeAddSurveyValidation();
  const addSurveyController = new AddSurveyController(validationComposite, dbAddSurvey);

  // Main
  return makeLogControllerDecorator(addSurveyController);
};
