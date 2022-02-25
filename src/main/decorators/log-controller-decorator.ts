import {
  LogErrorRepository, Controller, HttpRequest, HttpResponse,
} from './log-controller-decorator-protocols';

/*
A classe que vai decorar tem que ser do mesmo tipo da classe que tá
implementando/herdando
*/
export class LogControllerDecorator implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);

    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError(httpResponse.body.stack);
    }

    return httpResponse;
  }
}
