import { makeLoadSurveysController } from '@/main/factories';
import { adaptResolver } from '@/main/adapters';

export const survey = {
  Query: {
    surveys: async () => adaptResolver(makeLoadSurveysController()),
  },
};
