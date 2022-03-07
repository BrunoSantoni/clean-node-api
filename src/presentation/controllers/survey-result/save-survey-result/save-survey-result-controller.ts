import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from "./save-survey-result-controller-protocols";
import { InvalidParamError } from "@/presentation/errors";
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

    try {
      const { surveyId } = httpRequest.params;
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

    } catch(error) {
      return serverError(error);
    }
  }
}