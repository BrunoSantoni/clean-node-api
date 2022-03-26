import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols/db';
import { SaveSurveyResult } from '@/domain/usecases';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  async save(data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    await this.saveSurveyResultRepository.save(data);

    const { surveyId, accountId } = data;
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId, accountId);

    return surveyResult;
  }
}
