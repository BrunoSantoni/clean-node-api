import { noContent, serverError, success } from '@/presentation/helpers/http/http-helper';
import {
  Controller, HttpRequest, HttpResponse, LoadSurveys,
} from './load-surveys-controller-protocols';

export class LoadSurveysController implements Controller {
  constructor(
    private readonly loadSurveys: LoadSurveys,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load();

      if (!surveys.length) {
        return noContent();
      }

      return success(surveys);
    } catch (error) {
      return serverError(error);
    }
  }
}
