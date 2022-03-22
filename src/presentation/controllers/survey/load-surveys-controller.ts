import { LoadSurveys } from '@/domain/usecases';
import { noContent, serverError, success } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/protocols';

export namespace LoadSurveysController {
  export type Request = {
    accountId?: string;
  };
}

export class LoadSurveysController implements Controller {
  constructor(
    private readonly loadSurveys: LoadSurveys,
  ) {}

  async handle(request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const { accountId } = request;
      const surveys = await this.loadSurveys.load(accountId);

      if (!surveys.length) {
        return noContent();
      }

      return success(surveys);
    } catch (error) {
      return serverError(error);
    }
  }
}
