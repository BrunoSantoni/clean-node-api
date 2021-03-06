import faker from '@faker-js/faker';
import { SurveyModel } from '@/domain/models';
import { AddSurvey } from '@/domain/usecases';

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: faker.random.words(),
  answers: [
    {
      image: faker.image.imageUrl(),
      answer: faker.random.word(),
    }, {
      answer: faker.random.word(),
    },
  ],
  date: faker.date.recent(),
});

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.datatype.uuid(),
  didUserAnswered: faker.datatype.boolean(),
  ...mockAddSurveyParams(),
});
