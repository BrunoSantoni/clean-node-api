import faker from '@faker-js/faker';
import {
  AddSurveyRepository,
  CheckSurveyByIdRepository,
  LoadAnswersBySurveyRepository,
  LoadSurveyByIdRepository,
  LoadSurveysRepository,
} from '@/data/protocols';
import { mockSurveyModel } from '@/tests/domain/mocks';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  surveyData: AddSurveyRepository.Params;

  async add(surveyData: AddSurveyRepository.Params): Promise<AddSurveyRepository.Result> {
    this.surveyData = surveyData;
    return Promise.resolve();
  }
}

export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  id: string;

  result = true;

  async checkById(id: string): Promise<CheckSurveyByIdRepository.Result> {
    this.id = id;
    return Promise.resolve(this.result);
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  id: string;

  result = mockSurveyModel();

  async loadById(id: string): Promise<LoadSurveyByIdRepository.Result> {
    this.id = id;
    return Promise.resolve(this.result);
  }
}

export class LoadAnswersBySurveyRepositorySpy implements LoadAnswersBySurveyRepository {
  id: string;

  result = [faker.random.word(), faker.random.word()];

  async loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    this.id = id;
    return Promise.resolve(this.result);
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  accountId: string;

  surveyModels = [mockSurveyModel(), mockSurveyModel()];

  async loadAll(accountId: string): Promise<LoadSurveysRepository.Result> {
    this.accountId = accountId;
    return Promise.resolve(this.surveyModels);
  }
}
