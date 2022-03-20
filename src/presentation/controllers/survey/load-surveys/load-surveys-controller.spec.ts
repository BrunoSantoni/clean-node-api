import MockDate from 'mockdate';
import faker from '@faker-js/faker';
import { LoadSurveysController } from './load-surveys-controller';
import { HttpRequest } from './load-surveys-controller-protocols';
import { throwError } from '@/domain/test';
import { noContent, serverError, success } from '@/presentation/helpers/http/http-helper';
import { LoadSurveysSpy } from '@/presentation/test';

type SutTypes = {
  sut: LoadSurveysController;
  loadSurveysSpy: LoadSurveysSpy;
};

const mockRequest = (): HttpRequest => ({
  accountId: faker.datatype.uuid(),
});

const makeSut = (): SutTypes => {
  const loadSurveysSpy = new LoadSurveysSpy();
  const sut = new LoadSurveysController(loadSurveysSpy);

  return {
    sut,
    loadSurveysSpy,
  };
};

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date()); // Mockou o date do JS
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveys with correct value', async () => {
    const { sut, loadSurveysSpy } = makeSut();

    const httpRequest = mockRequest();
    await sut.handle(httpRequest);

    expect(loadSurveysSpy.accountId).toBe(httpRequest.accountId);
  });

  test('Should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut();

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(success(loadSurveysSpy.surveyModels));
  });

  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    loadSurveysSpy.surveyModels = [];

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(noContent());
  });

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysSpy } = makeSut();
    jest.spyOn(loadSurveysSpy, 'load').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
