import { LogErrorRepository } from '@/data/protocols/db';
import {} from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/protocols';

/*
A classe que vai decorar tem que ser do mesmo tipo da classe que tá
implementando/herdando
*/
export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository,
  ) {}

  async handle(request: any): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(request);

    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack);
    }

    return httpResponse;
  }
}
