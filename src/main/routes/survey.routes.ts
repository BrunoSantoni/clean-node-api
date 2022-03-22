import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express';
import { makeAddSurveyController, makeLoadSurveysController } from '@/main/factories/controllers';
import { auth } from '@/main/middlewares';

export default (router: Router): void => {
  router.post('/surveys', auth('admin'), adaptRoute(makeAddSurveyController()));
  router.get('/surveys', auth(), adaptRoute(makeLoadSurveysController()));
};
