import express from 'express';
import { setupApolloServer } from './apollo-server';
import { setupSwagger } from './swagger';
import { setupMiddlewares } from './middlewares';
import { setupRoutes } from './routes';
import { setupStaticFiles } from './static-files';

const app = express();
(async function () {
  await setupApolloServer(app);
  setupSwagger(app);
  setupStaticFiles(app); // Antes do Middlewares para não setar o content type
  setupMiddlewares(app);
  setupRoutes(app);
}());

export { app };
