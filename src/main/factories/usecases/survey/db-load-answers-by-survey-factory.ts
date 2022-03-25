import { DbLoadAnswersBySurvey } from '@/data/usecases/survey';
import { LoadAnswersBySurvey } from '@/domain/usecases';
import { SurveyMongoRepository } from '@/infra/db';

export const makeDbLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  // Infra
  const loadSurveyByIdRepository = new SurveyMongoRepository();

  // Data
  return new DbLoadAnswersBySurvey(loadSurveyByIdRepository);
};
