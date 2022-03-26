import {
  ApolloError, AuthenticationError, ForbiddenError, UserInputError,
} from 'apollo-server-express';
import { successStatusCodes } from '@/main/adapters/helpers';
import { Controller } from '@/presentation/protocols';

export const adaptResolver = async (controller: Controller, args: any): Promise<any> => {
  const httpResponse = await controller.handle(args);
  const { body, statusCode } = httpResponse;

  const statusCodesResponses = {
    200: body,
    204: body,
    400: new UserInputError(body.message),
    401: new AuthenticationError(body.message),
    403: new ForbiddenError(body.message),
    500: new ApolloError(body.message),
  };

  if (!successStatusCodes.includes(statusCode)) {
    throw statusCodesResponses[statusCode] || statusCodesResponses[500];
  }

  return statusCodesResponses[statusCode];
};
