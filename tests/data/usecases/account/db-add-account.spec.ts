import { DbAddAccount } from '@/data/usecases';
import { mockAddAccountParams, throwError } from '@/tests/domain/mocks';
import { AddAccountRepositorySpy, HasherSpy, CheckAccountByEmailRepositorySpy } from '@/tests/data/mocks';

type SutTypes = {
  sut: DbAddAccount;
  hasherSpy: HasherSpy;
  addAccountRepositorySpy: AddAccountRepositorySpy;
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepositorySpy;
};

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy();
  const addAccountRepositorySpy = new AddAccountRepositorySpy();
  const checkAccountByEmailRepositorySpy = new CheckAccountByEmailRepositorySpy();

  const sut = new DbAddAccount(
    hasherSpy,
    addAccountRepositorySpy,
    checkAccountByEmailRepositorySpy,
  );

  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    checkAccountByEmailRepositorySpy,
  };
};

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut();

    const addAccountParams = mockAddAccountParams();

    await sut.add(addAccountParams);
    expect(hasherSpy.plaintext).toBe(addAccountParams.password);
  });

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut();
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError);

    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSut();

    const addAccountParams = mockAddAccountParams();
    await sut.add(addAccountParams);

    expect(addAccountRepositorySpy.addAccountParams).toEqual({
      name: addAccountParams.name,
      email: addAccountParams.email,
      password: hasherSpy.digest, // No arquivo de produção, passa a senha com hash para o repository
    });
  });

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut();
    jest.spyOn(addAccountRepositorySpy, 'add').mockImplementationOnce(throwError);

    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut();

    const addAccountParams = mockAddAccountParams();
    await sut.add(addAccountParams);

    expect(checkAccountByEmailRepositorySpy.email).toBe(addAccountParams.email);
  });

  test('Should return false if CheckAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut();
    checkAccountByEmailRepositorySpy.result = true; // Retornando que achou uma conta com o e-mail

    const wasAccountCreated = await sut.add(mockAddAccountParams());
    expect(wasAccountCreated).toBe(false);
  });

  test('Should throw if CheckAccountByEmailRepository throws', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut();
    jest.spyOn(checkAccountByEmailRepositorySpy, 'checkByEmail').mockImplementationOnce(throwError);

    const promise = sut.add(mockAddAccountParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return false if AddAccountRepository returns false', async () => {
    const { sut, addAccountRepositorySpy } = makeSut();
    addAccountRepositorySpy.wasAccountCreated = false;

    const wasAccountCreated = await sut.add(mockAddAccountParams());
    expect(wasAccountCreated).toBe(false);
  });

  test('Should return true on success', async () => {
    const { sut } = makeSut();

    const wasAccountCreated = await sut.add(mockAddAccountParams());
    expect(wasAccountCreated).toBe(true);
  });
});
