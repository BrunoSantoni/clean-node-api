import { badRequest } from '../../../helpers/http/http-helper';
import { AddSurveyController } from './add-survey-controller';
import { HttpRequest, Validation } from './add-survey-controller-protocols';

type SutTypes = {
  sut: AddSurveyController;
  validationStub: Validation;
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate<T>(data: T): void | Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer',
    }],
  },
});

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new AddSurveyController(validationStub);

  return {
    sut,
    validationStub,
  };
};

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');
    await sut.handle(makeFakeRequest());

    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body);
  });

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(badRequest(new Error()));
  });
});
