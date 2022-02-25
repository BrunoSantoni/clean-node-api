import { adaptMiddleware } from '@/main/adapters/express/express-middleware-adapter';
import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middleware-factory';

export const auth = (role = null) => {
  if (!role) return adaptMiddleware(makeAuthMiddleware());
  return adaptMiddleware(makeAuthMiddleware(role));
};
