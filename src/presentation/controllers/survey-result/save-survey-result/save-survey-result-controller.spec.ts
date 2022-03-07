import MockDate from 'mockdate';
import { InvalidParamError } from "@/presentation/errors";
import { forbidden, serverError } from "@/presentation/helpers/http/http-helper";
import { SaveSurveyResultController } from "./save-survey-result-controller";
import {
  HttpRequest,
  LoadSurveyById,
  SaveSurveyResult,
  SurveyModel,
  SaveSurveyResultModel,
  SurveyResultModel,
} from "./save-survey-result-controller-protocols";

type SutTypes = {
  sut: SaveSurveyResultController,
  loadSurveyByIdStub: LoadSurveyById,
  saveSurveyResultStub: SaveSurveyResult,
}

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id',
  },
  body: {
    answer: 'any_answer',
  },
  accountId: 'any_account_id', // Injeta na request pelo Express
});

const makeFakeSurvey = (prefix = 'any'): SurveyModel => ({
  id: `${prefix}_id`,
  question: `${prefix}_question`,
  answers: [{
    image: `${prefix}_image`,
    answer: `${prefix}_answer`,
  }],
  date: new Date(),
});

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date(),
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(makeFakeSurvey());
    }
  }

  return new LoadSurveyByIdStub();
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return Promise.resolve(makeFakeSurveyResult());
    }
  }

  return new SaveSurveyResultStub();
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById();
  const saveSurveyResultStub = makeSaveSurveyResult();
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub);

  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub,
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById');

    await sut.handle(makeFakeRequest());

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeFakeRequest();
    httpRequest.body.answer = 'wrong_answer';

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const httpRequest = makeFakeRequest();
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save');

    await sut.handle(httpRequest);

    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: httpRequest.params.surveyId,
      accountId: httpRequest.accountId,
      date: new Date(),
      answer: httpRequest.body.answer,
    });
  });

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(Promise.reject(new Error()));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
})