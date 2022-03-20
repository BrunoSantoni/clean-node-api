import MockDate from 'mockdate';
import faker from '@faker-js/faker';
import { DbLoadSurveys } from './db-load-surveys';
import { LoadSurveysRepositorySpy } from '@/data/test';
import { throwError } from '@/domain/test';

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy();
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy);

  return {
    sut,
    loadSurveysRepositorySpy,
  };
};

let accountId: string;

describe('DbLoadSurveys Usecase', () => {
  beforeEach(() => {
    accountId = faker.datatype.uuid();
  });

  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveysRepository with correct value', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();

    await sut.load(accountId);

    expect(loadSurveysRepositorySpy.accountId).toBe(accountId);
  });

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll').mockImplementationOnce(throwError);

    const promise = sut.load(accountId);

    await expect(promise).rejects.toThrow();
  });

  test('Should return a survey list on success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();

    const surveys = await sut.load(accountId);

    expect(surveys).toEqual(loadSurveysRepositorySpy.surveyModels);
  });
});
