import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey';
import { mockSurveyModel } from '@/domain/test';
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys';
import { SurveyModel } from '@/domain/models/survey';

export class AddSurveySpy implements AddSurvey {
  surveyData: AddSurveyParams;

  async add(data: AddSurveyParams): Promise<void> {
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
