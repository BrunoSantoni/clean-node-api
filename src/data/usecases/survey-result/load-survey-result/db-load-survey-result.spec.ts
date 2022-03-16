import { DbLoadSurveyResult } from './db-load-survey-result';
import { LoadSurveyResultRepository, mockLoadSurveyResultRepository } from './db-load-survey-result-protocols';

type SutTypes = {
  sut: DbLoadSurveyResult;
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository;
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);

  return {
    sut,
    loadSurveyResultRepositoryStub,
  };
};

describe('DbLoadSurveyResult Usecase', () => {
  test('Should call LoadSurveyResultRepository with correct surveyId', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId');

    await sut.load('any_survey_id');

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id');
  });
});
