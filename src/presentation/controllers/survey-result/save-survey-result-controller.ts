import { LoadAnswersBySurvey, SaveSurveyResult } from '@/domain/usecases';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError, success } from '@/presentation/helpers';
import { Controller, HttpResponse } from '@/presentation/protocols';

export namespace SaveSurveyResultController {
  export type Request = {
    accountId: string;
    surveyId: string;
    answer: string;
  };
}

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadAnswersBySurvey: LoadAnswersBySurvey,
    private readonly saveSurveyResult: SaveSurveyResult,
  ) {}

  async handle(request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { accountId, surveyId, answer } = request;
      const answers = await this.loadAnswersBySurvey.loadAnswers(surveyId);

      if (!answers.length) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const isValidAnswer = answers.includes(answer);

      if (!isValidAnswer) {
        return forbidden(new InvalidParamError('answer'));
      }

      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date(),
      });

      return success(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}
