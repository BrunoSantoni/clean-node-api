import MockDate from 'mockdate';
import faker from '@faker-js/faker';
import { throwError } from '@/tests/domain/mocks';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError, success } from '@/presentation/helpers';
import { CheckSurveyByIdSpy, LoadSurveyResultSpy } from '@/tests/presentation/mocks';
import { LoadSurveyResultController } from '@/presentation/controllers';

type SutTypes = {
  sut: LoadSurveyResultController,
  checkSurveyByIdSpy: CheckSurveyByIdSpy,
  loadSurveyResultSpy: LoadSurveyResultSpy,
};

const mockRequest = (): LoadSurveyResultController.Request => ({
  accountId: faker.datatype.uuid(),
  surveyId: faker.datatype.uuid(),
});

const makeSut = (): SutTypes => {
  const checkSurveyByIdSpy = new CheckSurveyByIdSpy();
  const loadSurveyResultSpy = new LoadSurveyResultSpy();
  const sut = new LoadSurveyResultController(checkSurveyByIdSpy, loadSurveyResultSpy);

  return {
    sut,
    checkSurveyByIdSpy,
    loadSurveyResultSpy,
  };
};

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call CheckSurveyById with correct value', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut();

    const request = mockRequest();
    await sut.handle(request);

    expect(checkSurveyByIdSpy.surveyId).toBe(request.surveyId);
  });

  test('Should return 403 if CheckSurveyById returns false', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut();
    checkSurveyByIdSpy.result = false;

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();

    const request = mockRequest();
    await sut.handle(request);

    expect(loadSurveyResultSpy.surveyId).toBe(request.surveyId);
    expect(loadSurveyResultSpy.accountId).toBe(request.accountId);
  });

  test('Should return 500 if CheckSurveyById throws', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut();
    jest.spyOn(checkSurveyByIdSpy, 'checkById').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();
    jest.spyOn(loadSurveyResultSpy, 'load').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 on success', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();

    const request = mockRequest();
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(success(loadSurveyResultSpy.surveyResultModel));
  });
});
