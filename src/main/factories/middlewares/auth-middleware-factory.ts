import { AuthMiddleware } from '@/presentation/middlewares';
import { Middleware } from '@/presentation/protocols';
import { makeDbLoadAccountByToken } from '@/main/factories/usecases';

export const makeAuthMiddleware = (role?: string): Middleware => {
  // Data
  const dbLoadAccountByToken = makeDbLoadAccountByToken();

  // Presentation
  return new AuthMiddleware(dbLoadAccountByToken, role);
};
