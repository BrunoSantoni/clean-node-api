import { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { resolvers, typeDefs } from '@/main/graphql';

export const setupApolloServer = async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
  });

  await server.start();

  server.applyMiddleware({ app });
};
