import faker from '@faker-js/faker';
import { SaveSurveyResult } from '@/domain/usecases';
import { SurveyResultModel } from '@/domain/models';

export const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => ({
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
      isUserCurrentAnswer: faker.datatype.boolean(),
    },
    {
      answer: faker.random.word(),
      count: faker.datatype.number({ min: 0, max: 1000 }),
      percent: faker.datatype.number({ min: 0, max: 100 }),
      isUserCurrentAnswer: faker.datatype.boolean(),
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
      isUserCurrentAnswer: false,
    },
    {
      answer: faker.random.word(),
      count: 0,
      percent: 0,
      isUserCurrentAnswer: false,
    },
  ],
  date: faker.date.recent(),
});
