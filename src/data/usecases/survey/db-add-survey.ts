import { AddSurveyRepository } from '@/data/protocols/db';
import { AddSurvey, AddSurveyParams } from '@/domain/usecases';

export class DbAddSurvey implements AddSurvey {
  constructor(
    private readonly dbAddSurveyRepository: AddSurveyRepository,
  ) {}

  async add(data: AddSurveyParams): Promise<void> {
    await this.dbAddSurveyRepository.add(data);
  }
}
