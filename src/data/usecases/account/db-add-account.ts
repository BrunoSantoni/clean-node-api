import { AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols/db';
import { Hasher } from '@/data/protocols/cryptography';
import { AccountModel } from '@/domain/models';
import { AddAccount, AddAccountParams } from '@/domain/usecases';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async add(accountData: AddAccountParams): Promise<AccountModel> {
    const accountAlreadyExists = await this.loadAccountByEmailRepository.loadByEmail(
      accountData.email,
    );

    if (accountAlreadyExists) return null;

    const hashedPassword = await this.hasher.hash(accountData.password);
    const newAccount = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });
    return newAccount;
  }
}
