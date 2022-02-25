import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository';
import { Controller } from '@/presentation/protocols';
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator';

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  // Infra
  const logMongoRepository = new LogMongoRepository();

  // Main
  return new LogControllerDecorator(controller, logMongoRepository);
};
