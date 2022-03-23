import { AddSurvey, LoadSurveyById, LoadSurveys } from '@/domain/usecases';
import { mockSurveyModel } from '@/tests/domain/mocks';
import { SurveyModel } from '@/domain/models';

export class AddSurveySpy implements AddSurvey {
  surveyData: AddSurvey.Params;

  async add(data: AddSurvey.Params): Promise<void> {
    this.surveyData = data;
    return Promise.resolve();
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  accountId: string;

  surveyModels = [mockSurveyModel(), mockSurveyModel()];

  async load(accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId;
    return Promise.resolve(this.surveyModels);
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  surveyId: string;

  surveyModel = mockSurveyModel();

  async loadById(id: string): Promise<SurveyModel> {
    this.surveyId = id;
    return Promise.resolve(this.surveyModel);
  }
}
