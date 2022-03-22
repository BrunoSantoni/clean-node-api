import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@/data/protocols/db';
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases';
import { SurveyResultModel } from '@/domain/models';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
  ) {}

  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data);

    const { surveyId, accountId } = data;
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId, accountId);

    return surveyResult;
  }
}