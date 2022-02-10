import { AddSurvey, AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols';

export class DbAddSurvey implements AddSurvey {
  constructor(
    private readonly dbAddAccountRepository: AddSurveyRepository,
  ) {}

  async add(data: AddSurveyModel): Promise<void> {
    await this.dbAddAccountRepository.add(data);
  }
}
