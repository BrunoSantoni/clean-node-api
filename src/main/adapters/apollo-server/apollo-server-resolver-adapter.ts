import {
  ApolloError, AuthenticationError, ForbiddenError, UserInputError,
} from 'apollo-server-express';
import { successStatusCodes } from '@/main/adapters/helpers';
import { Controller } from '@/presentation/protocols';

export const adaptResolver = async (controller: Controller, args?: any, context?: any): Promise<any> => {
  const request = {
    ...(args || {}),
    /*
    Se não passar isso não vai ter como saber quem é o usuário,
    acarretando em erro no Survey Result,
    não conseguindo identificar as flag de 'didUserAnswered' e 'isUserCurrentAnswer'
    no survey result, elas sempre viriam como false
    */
    accountId: context?.req?.accountId,
  };
  const httpResponse = await controller.handle(request);
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
