import MockDate from 'mockdate';
import faker from '@faker-js/faker';
import { LoadSurveysController } from '@/presentation/controllers';
import { throwError } from '@/tests/domain/mocks';
import { noContent, serverError, success } from '@/presentation/helpers';
import { LoadSurveysSpy } from '@/tests/presentation/mocks';

type SutTypes = {
  sut: LoadSurveysController;
  loadSurveysSpy: LoadSurveysSpy;
};

const mockRequest = (): LoadSurveysController.Request => ({
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

    const request = mockRequest();
    await sut.handle(request);

    expect(loadSurveysSpy.accountId).toBe(request.accountId);
  });

  test('Should return 200 on success', async () => {
    const { sut, loadSurveysSpy } = makeSut();

    const httpResponse = await sut.handle({} as LoadSurveysController.Request);

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

    const httpResponse = await sut.handle({} as LoadSurveysController.Request);

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
