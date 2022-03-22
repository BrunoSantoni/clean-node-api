import { LoadSurveys } from '@/domain/usecases';
import { noContent, serverError, success } from '@/presentation/helpers';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

export class LoadSurveysController implements Controller {
  constructor(
    private readonly loadSurveys: LoadSurveys,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest;
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
