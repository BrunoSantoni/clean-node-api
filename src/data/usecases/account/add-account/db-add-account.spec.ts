import {
  AccountModel, AddAccountParams, Hasher, AddAccountRepository, LoadAccountByEmailRepository,
} from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';
import { mockAccountModel, mockAddAccountParams, throwError } from '@/domain/test';

type SutTypes = {
  sut: DbAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return Promise.resolve('any_password');
    }
  }

  return new HasherStub();
};

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountModel> {
      return Promise.resolve(null);
    }
  }

  return new LoadAccountByEmailRepositoryStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }
  }

  return new AddAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();

  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  );

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  };
};

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, 'hash');

    await sut.add(mockAddAccountParams());
    expect(hashSpy).toHaveBeenCalledWith('any_password');
  });

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError);

    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    await sut.add(mockAddAccountParams());
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError);

    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();

    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual(mockAccountModel());
  });

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

    await sut.add(mockAddAccountParams());

    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should return null if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(mockAccountModel()));

    const account = await sut.add(mockAddAccountParams());
    expect(account).toBeNull();
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError);

    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });
});
