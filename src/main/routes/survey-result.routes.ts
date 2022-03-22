import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express';
import { auth } from '@/main/middlewares';
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories/controllers';

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth(), adaptRoute(makeSaveSurveyResultController()));
  router.get('/surveys/:surveyId/results', auth(), adaptRoute(makeLoadSurveyResultController()));
};
