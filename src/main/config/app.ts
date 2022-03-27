import express, { Express } from 'express';
import { setupSwagger } from '@/main/config/swagger';
import { setupMiddlewares } from '@/main/config/middlewares';
import { setupRoutes } from '@/main/config/routes';
import { setupStaticFiles } from '@/main/config/static-files';
import { setupApolloServer } from '@/main/graphql/apollo';

export const setupApp = async (): Promise<Express> => {
  const app = express();
  const apolloServer = setupApolloServer();
  setupSwagger(app);
  setupStaticFiles(app); // Antes do Middlewares para não setar o content type
  setupMiddlewares(app);
  setupRoutes(app);

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  return app;
};
