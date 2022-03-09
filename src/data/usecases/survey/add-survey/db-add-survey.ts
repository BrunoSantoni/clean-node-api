import { AddSurvey, AddSurveyParams, AddSurveyRepository } from './db-add-survey-protocols';

export class DbAddSurvey implements AddSurvey {
  constructor(
    private readonly dbAddSurveyRepository: AddSurveyRepository,
  ) {}

  async add(data: AddSurveyParams): Promise<void> {
    await this.dbAddSurveyRepository.add(data);
  }
}
