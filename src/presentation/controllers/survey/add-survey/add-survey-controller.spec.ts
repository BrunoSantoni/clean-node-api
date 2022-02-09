import { AddSurveyController } from './add-survey-controller';
import { HttpRequest, Validation } from './add-survey-controller-protocols';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer',
    }],
  },
});

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    class ValidationStub implements Validation {
      validate<T>(data: T): void | Error {
        return null;
      }
    }
    const validationStub = new ValidationStub();
    const sut = new AddSurveyController(validationStub);

    const validateSpy = jest.spyOn(validationStub, 'validate');
    await sut.handle(makeFakeRequest());

    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body);
  });
});
