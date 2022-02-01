import { Router } from 'express';
import { adaptRoute } from '../adapters/express-route-adapter';
import { makeSignUpController } from '../factories/signup/signup-factory';

export default (router: Router): void => {
  const signUpController = makeSignUpController();

  router.post('/signup', adaptRoute(signUpController));
};
