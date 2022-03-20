import faker from '@faker-js/faker';
import { SurveyModel } from '@/domain/models/survey';
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey';

export const mockAddSurveyParams = (): AddSurveyParams => ({
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
  ...mockAddSurveyParams(),
});
