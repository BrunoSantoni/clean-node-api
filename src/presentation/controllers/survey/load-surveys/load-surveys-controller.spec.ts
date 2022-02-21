import MockDate from 'mockdate';
import { LoadSurveysController } from './load-surveys-controller';
import { LoadSurveys, SurveyModel } from './load-surveys-controller-protocols';

type SutTypes = {
  sut: LoadSurveysController;
  loadSurveysStub: LoadSurveys;
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

const makeLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return new Promise((resolve) => resolve([makeFakeSurvey(), makeFakeSurvey('other')]));
    }
  }

  return new LoadSurveysStub();
};

const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveys();
  const sut = new LoadSurveysController(loadSurveysStub);

  return {
    sut,
    loadSurveysStub,
  };
};

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date()); // Mockou o date do JS
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('Should call LoadSurveys correctly', async () => {
    const { sut, loadSurveysStub } = makeSut();
    const loadSpy = jest.spyOn(loadSurveysStub, 'load');

    await sut.handle({});

    expect(loadSpy).toHaveBeenCalled();
  });
});
