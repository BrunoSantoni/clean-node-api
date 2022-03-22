import { LogMongoRepository } from '@/infra/db';
import { Controller } from '@/presentation/protocols';
import { LogControllerDecorator } from '@/main/decorators';

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  // Infra
  const logMongoRepository = new LogMongoRepository();

  // Main
  return new LogControllerDecorator(controller, logMongoRepository);
};
