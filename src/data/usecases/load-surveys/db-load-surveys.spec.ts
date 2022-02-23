import MockDate from 'mockdate';
import { DbLoadSurveys } from './db-load-surveys';
import { LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols';

type SutTypes = {
  sut: DbLoadSurveys;
  loadSurveysRepositoryStub: LoadSurveysRepository;
};

const makeFakeSurvey = (prefix = 'any'): SurveyModel => ({
  id: `${prefix}_id`,
  question: `${prefix}_question`,
  answers: [{
    image: `${prefix}_image`,
    answer: `${prefix}_answer`,
  }],
  date: new Date(),
});

const makeLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return new Promise((resolve) => resolve([makeFakeSurvey(), makeFakeSurvey('other')]));
    }
  }

  return new LoadSurveysRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository();
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub);

  return {
    sut,
    loadSurveysRepositoryStub,
  };
};

describe('DbLoadSurveys Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll');

    await sut.load();

    expect(loadAllSpy).toHaveBeenCalled();
  });

  test('Should return a survey list on success', async () => {
    const { sut } = makeSut();

    const surveys = await sut.load();
    const expectedResponse = [makeFakeSurvey(), makeFakeSurvey('other')];

    expect(surveys).toEqual(expectedResponse);
  });

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut();
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const promise = sut.load();

    await expect(promise).rejects.toThrow();
  });
});
