import { NextFunction, Request, Response } from 'express';
import { successStatusCodes } from '@/main/adapters/helpers';
import { Middleware } from '@/presentation/protocols';

export const adaptMiddleware = (middleware: Middleware) => async (
  req: Request,
  res: Response, next: NextFunction,
) => {
  const request = {
    accessToken: req.headers?.['x-access-token'],
    ...(req.headers || {}),
  };

  const httpResponse = await middleware.handle(request);

  if (!successStatusCodes.includes(httpResponse.statusCode)) {
    return res.status(httpResponse.statusCode).json({
      error: httpResponse.body.message,
    });
  }

  Object.assign(req, httpResponse.body);

  return next();
};
