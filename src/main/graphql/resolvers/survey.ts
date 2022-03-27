import { makeLoadSurveysController } from '@/main/factories';
import { adaptResolver } from '@/main/adapters';

export const survey = {
  Query: {
    surveys: async (parent: any, args: any, context: any) => adaptResolver(makeLoadSurveysController(), args, context),
  },
};
