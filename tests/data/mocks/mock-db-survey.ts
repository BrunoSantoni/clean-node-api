import { AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '@/data/protocols';
import { AddSurveyParams } from '@/domain/usecases';
import { SurveyModel } from '@/domain/models';
import { mockSurveyModel } from '@/tests/domain/mocks';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  surveyData: AddSurveyParams;

  async add(surveyData: AddSurveyParams): Promise<void> {
    this.surveyData = surveyData;
    return Promise.resolve();
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  id: string;

  surveyModel = mockSurveyModel();

  async loadById(id: string): Promise<SurveyModel> {
    this.id = id;
    return Promise.resolve(this.surveyModel);
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  accountId: string;

  surveyModels = [mockSurveyModel(), mockSurveyModel()];

  async loadAll(accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId;
    return Promise.resolve(this.surveyModels);
  }
}
