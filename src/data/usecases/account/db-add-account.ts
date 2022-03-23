import { AddAccountRepository, LoadAccountByEmailRepository } from '@/data/protocols/db';
import { Hasher } from '@/data/protocols/cryptography';
import { AddAccount } from '@/domain/usecases';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) {}

  async add(accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const accountAlreadyExists = await this.loadAccountByEmailRepository.loadByEmail(
      accountData.email,
    );

    if (accountAlreadyExists) return false;

    const hashedPassword = await this.hasher.hash(accountData.password);
    const wasAccountCreated = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });
    return !!wasAccountCreated;
  }
}
