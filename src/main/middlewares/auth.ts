import { adaptMiddleware } from '../adapters/express/express-middleware-adapter';
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory';

export const auth = (role = null) => {
  if (!role) return adaptMiddleware(makeAuthMiddleware());
  return adaptMiddleware(makeAuthMiddleware(role));
};
