import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories';
import { adaptResolver } from '@/main/adapters';

export const surveyResult = {
  Query: {
    loadSurveyResult: async (parent: any, args: any, context: any) => adaptResolver(makeLoadSurveyResultController(), args, context),
  },
  Mutation: {
    saveSurveyResult: async (parent: any, args: any, context: any) => adaptResolver(makeSaveSurveyResultController(), args, context),
  },
};
