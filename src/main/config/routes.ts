import { Express, Router } from 'express';
import fg from 'fast-glob';

export const setupRoutes = (app: Express) => {
  const router = Router();
  app.use('/api', router);
  const files = fg.sync('**/src/main/routes/**routes.ts');

  files.forEach(async (file) => {
    const route = (await import(`../../../${file}`)).default;
    route(router);
  });
};
