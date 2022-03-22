import MockDate from 'mockdate';
import faker from '@faker-js/faker';
import { SaveSurveyResultController } from '@/presentation/controllers';
import { throwError } from '@/tests/domain/mocks';
import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError, success } from '@/presentation/helpers';
import { LoadSurveyByIdSpy, SaveSurveyResultSpy } from '@/tests/presentation/mocks';

type SutTypes = {
  sut: SaveSurveyResultController,
  loadSurveyByIdSpy: LoadSurveyByIdSpy,
  saveSurveyResultSpy: SaveSurveyResultSpy,
};

const mockRequest = (answer: string = null): SaveSurveyResultController.Request => ({
  accountId: faker.datatype.uuid(), // Injeta na request pelo Express
  surveyId: faker.datatype.uuid(),
  answer,
});

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy();
  const saveSurveyResultSpy = new SaveSurveyResultSpy();
  const sut = new SaveSurveyResultController(loadSurveyByIdSpy, saveSurveyResultSpy);

  return {
    sut,
    loadSurveyByIdSpy,
    saveSurveyResultSpy,
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
    const { sut, loadSurveyByIdSpy } = makeSut();

    const request = mockRequest();
    await sut.handle(request);

    expect(loadSurveyByIdSpy.surveyId).toBe(request.surveyId);
  });

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    loadSurveyByIdSpy.surveyModel = null;

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut();
    const request = mockRequest();
    request.answer = 'wrong_answer';

    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')));
  });

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut();
    const request = mockRequest(loadSurveyByIdSpy.surveyModel.answers[0].answer); // Passando uma resposta correta para não dar throw

    await sut.handle(request);

    const { surveyId, accountId, answer } = request;
    expect(saveSurveyResultSpy.data).toEqual({
      surveyId,
      accountId,
      date: new Date(),
      answer,
    });
  });

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut();
    jest.spyOn(saveSurveyResultSpy, 'save').mockImplementationOnce(throwError);

    const request = mockRequest(loadSurveyByIdSpy.surveyModel.answers[0].answer); // Passando uma resposta correta para não dar throw antes de chamar o SaveSurveyResult
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 on success', async () => {
    const { sut, saveSurveyResultSpy, loadSurveyByIdSpy } = makeSut();

    const request = mockRequest(loadSurveyByIdSpy.surveyModel.answers[0].answer); // Passando uma resposta correta para não dar throw antes de chamar o SaveSurveyResult
    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(success(saveSurveyResultSpy.surveyResultModel));
  });
});
