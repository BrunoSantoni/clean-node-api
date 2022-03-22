import { Request, Response } from 'express';
import { Controller } from '@/presentation/protocols';

export const adaptRoute = (controller: Controller) => async (req: Request, res: Response) => {
  const request = {
    ...(req.body || {}),
    ...(req.params || {}),
    accountId: req.accountId,
  };

  const successStatusCodes = [200, 204];
  const httpResponse = await controller.handle(request);

  if (!successStatusCodes.includes(httpResponse.statusCode)) {
    return res.status(httpResponse.statusCode).json({
      error: httpResponse.body.message,
    });
  }

  return res.status(httpResponse.statusCode).json(httpResponse.body);
};
