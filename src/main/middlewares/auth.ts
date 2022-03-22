import { adaptMiddleware } from '@/main/adapters/express';
import { makeAuthMiddleware } from '@/main/factories/middlewares';

export const auth = (role = null) => {
  if (!role) return adaptMiddleware(makeAuthMiddleware());
  return adaptMiddleware(makeAuthMiddleware(role));
};
