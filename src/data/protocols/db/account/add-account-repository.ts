import { AddAccountParams } from '@/domain/usecases';
import { AccountModel } from '@/domain/models';

export type AddAccountRepository = {
  add(accountData: AddAccountParams): Promise<AccountModel>;
};
