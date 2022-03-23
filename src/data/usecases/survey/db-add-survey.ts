import { AddSurveyRepository } from '@/data/protocols/db';
import { AddSurvey } from '@/domain/usecases';

export class DbAddSurvey implements AddSurvey {
  constructor(
    private readonly dbAddSurveyRepository: AddSurveyRepository,
  ) {}

  async add(data: AddSurvey.Params): Promise<AddSurvey.Result> {
    await this.dbAddSurveyRepository.add(data);
  }
}
