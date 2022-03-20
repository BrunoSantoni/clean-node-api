import faker from '@faker-js/faker';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result';
import { SurveyResultModel } from '@/domain/models/survey-result';

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: faker.datatype.uuid(),
  surveyId: faker.datatype.uuid(),
  answer: faker.random.word(),
  date: faker.date.recent(),
});

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [
    {
      image: faker.image.imageUrl(),
      answer: faker.random.word(),
      count: faker.datatype.number({ min: 0, max: 1000 }),
      percent: faker.datatype.number({ min: 0, max: 100 }),
    },
    {
      answer: faker.random.word(),
      count: faker.datatype.number({ min: 0, max: 1000 }),
      percent: faker.datatype.number({ min: 0, max: 100 }),
    },
  ],
  date: faker.date.recent(),
});

export const mockEmptySurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [
    {
      image: faker.image.imageUrl(),
      answer: faker.random.word(),
      count: 0,
      percent: 0,
    },
    {
      answer: faker.random.word(),
      count: 0,
      percent: 0,
    },
  ],
  date: faker.date.recent(),
});
