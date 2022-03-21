import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express/express-route-adapter';
import { makeSignUpController } from '@/main/factories/controllers/account/signup-controller-factory';
import { makeLoginController } from '@/main/factories/controllers/account/login-controller-factory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
  router.post('/login', adaptRoute(makeLoginController()));
};
