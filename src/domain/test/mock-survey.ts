import { SurveyModel } from '@/domain/models/survey';
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey';

export const mockAddSurveyParams = (prefix = 'any'): AddSurveyParams => ({
  question: `${prefix}_question`,
  answers: [
    {
      image: `${prefix}_image`,
      answer: `${prefix}_answer`,
    }, {
      answer: 'other_answer',
    },
  ],
  date: new Date(),
});

export const mockSurveyModel = (prefix = 'any'): SurveyModel => ({
  id: `${prefix}_survey_id`,
  ...mockAddSurveyParams(prefix),
});
