import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express/express-route-adapter';
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey-controller-factory';
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys-controller-factory';
import { auth } from '@/main/middlewares/auth';

export default (router: Router): void => {
  router.post('/surveys', auth('admin'), adaptRoute(makeAddSurveyController()));
  router.get('/surveys', auth(), adaptRoute(makeLoadSurveysController()));
};
