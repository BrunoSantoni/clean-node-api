import { AddAccount } from '@/domain/usecases';

// Assim o infra não depende mais do domain
export namespace AddAccountRepository {
  export type Params = AddAccount.Params;
  export type Result = boolean;
}

export interface AddAccountRepository {
  add(accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result>;
}
