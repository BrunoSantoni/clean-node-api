import MockDate from 'mockdate';
import { SaveSurveyResultController } from './save-survey-result-controller';
import {
  HttpRequest,
  LoadSurveyById,
  SaveSurveyResult,
} from './save-survey-result-controller-protocols';
import { mockSurveyResultModel } from '@/domain/test';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError, success } from '@/presentation/helpers/http/http-helper';
import { mockLoadSurveyById, mockSaveSurveyResult } from '@/presentation/test';

type SutTypes = {
  sut: SaveSurveyResultController,
  loadSurveyByIdStub: LoadSurveyById,
  saveSurveyResultStub: SaveSurveyResult,
};

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id',
  },
  body: {
    answer: 'any_answer',
  },
  accountId: 'any_account_id', // Injeta na request pelo Express
});

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById();
  const saveSurveyResultStub = mockSaveSurveyResult();
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub);

  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub,
  };
};

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

    await sut.handle(mockRequest());

    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null));

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = mockRequest();
    httpRequest.body.answer = 'wrong_answer';

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut();
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()));

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut();
    const httpRequest = mockRequest();
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

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 on success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(success(mockSurveyResultModel()));
  });
});
