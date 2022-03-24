import {
  AddSurvey,
  CheckSurveyById,
  LoadSurveyById,
  LoadSurveys,
} from '@/domain/usecases';
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

export class CheckSurveyByIdSpy implements CheckSurveyById {
  surveyId: string;

  result = true;

  async checkById(id: string): Promise<CheckSurveyById.Result> {
    this.surveyId = id;
    return Promise.resolve(this.result);
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
