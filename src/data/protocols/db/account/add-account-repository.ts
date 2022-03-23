import { AddAccount } from '@/domain/usecases';
import { AccountModel } from '@/domain/models';

// Assim o infra não depende mais do domain
export namespace AddAccountRepository {
  export type Params = AddAccount.Params;
  export type Result = AccountModel;
}

export interface AddAccountRepository {
  add(accountData: AddAccountRepository.Params): Promise<AddAccountRepository.Result>;
}
