import { Request, Response } from 'express';
import { successStatusCodes } from '@/main/adapters/helpers';
import { Controller } from '@/presentation/protocols';

export const adaptRoute = (controller: Controller) => async (req: Request, res: Response) => {
  const request = {
    ...(req.body || {}),
    ...(req.params || {}),
    accountId: req.accountId,
  };

  const httpResponse = await controller.handle(request);

  if (!successStatusCodes.includes(httpResponse.statusCode)) {
    return res.status(httpResponse.statusCode).json({
      error: httpResponse.body.message,
    });
  }

  return res.status(httpResponse.statusCode).json(httpResponse.body);
};
