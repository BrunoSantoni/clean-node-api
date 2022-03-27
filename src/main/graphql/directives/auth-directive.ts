import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { ForbiddenError } from 'apollo-server-express';
import { GraphQLSchema } from 'graphql';
import { makeAuthMiddleware } from '@/main/factories';

export const authDirectiveTransformer = (schema: GraphQLSchema): GraphQLSchema => mapSchema(schema, {
  [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
    const authDirective = getDirective(schema, fieldConfig, 'auth');
    if (authDirective) {
      const { resolve } = fieldConfig;
      // eslint-disable-next-line no-param-reassign
      fieldConfig.resolve = async (parent, args, context, info) => {
        const request = {
          accessToken: context?.req?.headers?.['x-access-token'], // Como se fosse o request do express
        };

        const authMiddleware = makeAuthMiddleware();

        const httpResponse = await authMiddleware.handle(request);

        if (httpResponse.statusCode === 200) {
          Object.assign(context?.req, httpResponse.body);
          return resolve.call(this, parent, args, context, info);
        }

        throw new ForbiddenError(httpResponse.body.message);
      };
    }
    return fieldConfig;
  },
});
