import { AccountModel } from '@/domain/models';

export namespace AddAccount {
  export type Params = Omit<AccountModel, 'id'>;
  export type Result = boolean;
}
export interface AddAccount {
  add (account: AddAccount.Params): Promise<AddAccount.Result>;
}
