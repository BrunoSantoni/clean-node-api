import MockDate from 'mockdate';
import { DbAddSurvey } from '@/data/usecases';
import { AddSurveyRepositorySpy } from '@/tests/data/mocks';
import { mockAddSurveyParams, throwError } from '@/tests/domain/mocks';

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositorySpy: AddSurveyRepositorySpy;
};

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy();
  const sut = new DbAddSurvey(addSurveyRepositorySpy);

  return {
    sut,
    addSurveyRepositorySpy,
  };
};

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut();
    const fakeSurveyData = mockAddSurveyParams();

    await sut.add(fakeSurveyData);

    expect(addSurveyRepositorySpy.surveyData).toEqual(fakeSurveyData);
  });

  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut();
    jest.spyOn(addSurveyRepositorySpy, 'add').mockImplementationOnce(throwError);

    const promise = sut.add(mockAddSurveyParams());

    await expect(promise).rejects.toThrow();
  });
});
