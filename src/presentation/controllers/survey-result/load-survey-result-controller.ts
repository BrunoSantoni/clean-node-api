import { LoadSurveyById, LoadSurveyResult } from '@/domain/usecases';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError, success } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/protocols';

export namespace LoadSurveyResultController {
  export type Request = {
    accountId: string;
    surveyId: string;
  };
}

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult,
  ) {}

  async handle(request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { accountId, surveyId } = request;
      const survey = await this.loadSurveyById.loadById(surveyId);

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const surveyResult = await this.loadSurveyResult.load(surveyId, accountId);

      return success(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}
