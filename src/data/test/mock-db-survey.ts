import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey';
import { SurveyModel } from '@/domain/models/survey';
import { mockSurveyModel } from '@/domain/test';

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
