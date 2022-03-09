import { AddAccountParams } from '@/domain/usecases/account/add-account';
import { AccountModel } from '@/domain/models/account';

export type AddAccountRepository = {
  add(accountData: AddAccountParams): Promise<AccountModel>;
};
