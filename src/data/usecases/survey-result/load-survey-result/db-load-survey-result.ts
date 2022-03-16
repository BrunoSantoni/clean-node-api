import {
  LoadSurveyResultRepository, LoadSurveyResult, SurveyResultModel, LoadSurveyByIdRepository,
} from './db-load-survey-result-protocols';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository,
  ) {}

  async load(surveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId);

    if (surveyResult) {
      return surveyResult;
    }

    const survey = await this.loadSurveyByIdRepository.loadById(surveyId);

    const newSurveyResult: SurveyResultModel = {
      surveyId: survey.id,
      question: survey.question,
      date: survey.date,
      answers: survey.answers.map((answer) => ({
        ...answer,
        count: 0,
        percent: 0,
      })),
    };

    return newSurveyResult;
  }
}
