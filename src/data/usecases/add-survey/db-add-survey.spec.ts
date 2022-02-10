import { DbAddSurvey } from './db-add-survey';
import { AddSurvey, AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols';

type SutTypes = {
  sut: DbAddSurvey;
  addSurveyRepositoryStub: AddSurvey;
};

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer',
  }],
});

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(surveyData: AddSurveyModel): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  return new AddSurveyRepositoryStub();
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);

  return {
    sut,
    addSurveyRepositoryStub,
  };
};

describe('DbAddSurvey Usecase', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const fakeSurveyData = makeFakeSurveyData();

    await sut.add(fakeSurveyData);

    expect(addSpy).toHaveBeenCalledWith(fakeSurveyData);
  });
});
