import { Controller, HttpRequest, HttpResponse, LoadSurveyById, SaveSurveyResult } from "./save-survey-result-controller-protocols";
import { InvalidParamError } from "@/presentation/errors";
import { forbidden, serverError, success } from '@/presentation/helpers/http/http-helper';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

    try {
      const { surveyId } = httpRequest.params;
      const { accountId } = httpRequest;
      const { answer } = httpRequest.body;
      const survey = await this.loadSurveyById.loadById(surveyId);
  
      if(!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const answers = survey.answers.map(surveyAnswer => surveyAnswer.answer);
      const isValidAnswer = answers.includes(answer);

      if(!isValidAnswer) {
        return forbidden(new InvalidParamError('answer'));
      }

      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date(),
      });

      return success(surveyResult);

    } catch(error) {
      return serverError(error);
    }
  }
}