import faker from '@faker-js/faker';
import { DbLoadAnswersBySurvey } from '@/data/usecases';
import { LoadAnswersBySurveyRepositorySpy } from '@/tests/data/mocks';
import { throwError } from '@/tests/domain/mocks';

type SutTypes = {
  sut: DbLoadAnswersBySurvey;
  loadAnswersBySurveyRepositorySpy: LoadAnswersBySurveyRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositorySpy = new LoadAnswersBySurveyRepositorySpy();
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositorySpy);

  return {
    sut,
    loadAnswersBySurveyRepositorySpy,
  };
};

let surveyId: string;

describe('DbLoadAnswersBySurvey Usecase', () => {
  beforeEach(() => {
    surveyId = faker.datatype.uuid();
  });

  test('Should call LoadAnswersBySurvey with correct id', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
    await sut.loadAnswers(surveyId);

    expect(loadAnswersBySurveyRepositorySpy.id).toBe(surveyId);
  });

  test('Should throw if LoadAnswersBySurvey throws', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
    jest.spyOn(loadAnswersBySurveyRepositorySpy, 'loadAnswers').mockImplementationOnce(throwError);

    const promise = sut.loadAnswers(surveyId);

    await expect(promise).rejects.toThrow();
  });

  test('Should return all survey answers on success', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
    const answers = await sut.loadAnswers(surveyId);

    expect(answers).toEqual(loadAnswersBySurveyRepositorySpy.result);
  });

  test('Should return empty array if LoadAnswersBySurvey returns []', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut();
    loadAnswersBySurveyRepositorySpy.result = [];

    const answers = await sut.loadAnswers(surveyId);

    expect(answers).toEqual([]);
  });
});
