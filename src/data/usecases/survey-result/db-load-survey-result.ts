import { LoadSurveyByIdRepository, LoadSurveyResultRepository } from '@/data/protocols/db';
import { LoadSurveyResult } from '@/domain/usecases';
import { SurveyModel, SurveyResultModel } from '@/domain/models';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}

  async load(surveyId: string, accountId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId, accountId);

    if (surveyResult) {
      return surveyResult;
    }

    const survey = await this.loadSurveyByIdRepository.loadById(surveyId);

    const newSurveyResult = this.makeEmptySurveyResult(survey);

    return newSurveyResult;
  }

  private makeEmptySurveyResult(survey: SurveyModel): SurveyResultModel {
    return {
      surveyId: survey.id,
      question: survey.question,
      date: survey.date,
      answers: survey.answers.map((answer) => ({
        ...answer,
        count: 0,
        percent: 0,
        isUserCurrentAnswer: false,
      })),
    };
  }
}
