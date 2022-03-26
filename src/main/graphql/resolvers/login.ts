import { adaptResolver } from '@/main/adapters';
import { makeLoginController } from '@/main/factories';

export const login = {
  Query: {
    login: async (parent: any, args: any) => adaptResolver(makeLoginController(), args),
  },
};
