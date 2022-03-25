import faker from '@faker-js/faker';
import {
  AddSurvey,
  CheckSurveyById,
  LoadAnswersBySurvey,
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

export class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
  surveyId: string;

  result = [faker.random.word(), faker.random.word()];

  async loadAnswers(id: string): Promise<LoadAnswersBySurvey.Result> {
    this.surveyId = id;
    return Promise.resolve(this.result);
  }
}
