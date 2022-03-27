import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories';
import { adaptResolver } from '@/main/adapters';

export const surveyResult = {
  Query: {
    loadSurveyResult: async (parent: any, args: any) => adaptResolver(makeLoadSurveyResultController(), args),
  },
  Mutation: {
    saveSurveyResult: async (parent: any, args: any) => adaptResolver(makeSaveSurveyResultController(), args),
  },
};
