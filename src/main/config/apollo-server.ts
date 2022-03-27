import { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { GraphQLError } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { resolvers, typeDefs } from '@/main/graphql';
import { authDirectiveTransformer } from '@/main/graphql/directives';

const checkError = (error: GraphQLError, errorName: string): boolean => [error.name, error.originalError?.name].some((name) => name === errorName);

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors?.forEach((error) => {
    response.data = undefined;
    if (checkError(error, 'UserInputError')) {
      response.http.status = 400;
    } else if (checkError(error, 'AuthenticationError')) {
      response.http.status = 401;
    } else if (checkError(error, 'ForbiddenError')) {
      response.http.status = 403;
    } else {
      response.http.status = 500;
    }
  });
};

let schema = makeExecutableSchema({ resolvers, typeDefs });
schema = authDirectiveTransformer(schema);

export const setupApolloServer = async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }), // Contexto vai compartilhar os dados do request entre quaisquer query
    // Alterando o statuscode na resposta
    plugins: [{
      async requestDidStart() {
        return {
          async willSendResponse({ response, errors }) {
            return handleErrors(response, errors);
          },
        };
      },
    }],
  });

  await server.start();

  server.applyMiddleware({ app });
};
