import faker from '@faker-js/faker';
import { DbLoadAccountByToken } from './db-load-account-by-token';
import { LoadAccountByTokenRepository } from './db-load-account-by-token-protocols';
import { DecrypterSpy, mockLoadAccountByTokenRepository } from '@/data/test';
import { mockAccountModel, throwError } from '@/domain/test';

type SutTypes = {
  sut: DbLoadAccountByToken,
  decrypterSpy: DecrypterSpy,
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository,
};

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy();
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository();
  const sut = new DbLoadAccountByToken(decrypterSpy, loadAccountByTokenRepositoryStub);

  return {
    sut,
    decrypterSpy,
    loadAccountByTokenRepositoryStub,
  };
};

let token: string;
let role: string;

describe('DbLoadAccountByToken Usecase', () => {
  beforeEach(() => {
    token = faker.datatype.uuid();
    role = faker.random.word();
  });

  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterSpy } = makeSut();

    await sut.load(token, role);

    expect(decrypterSpy.ciphertext).toBe(token);
  });

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut();
    jest.spyOn(decrypterSpy, 'decrypt').mockReturnValueOnce(Promise.resolve(null));

    const account = await sut.load(token, role);

    expect(account).toBeNull();
  });

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken');

    await sut.load(token, role);

    expect(loadByTokenSpy).toHaveBeenCalledWith(token, role);
  });

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null));

    const account = await sut.load(token, role);

    expect(account).toBeNull();
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();

    const account = await sut.load(token, role);

    expect(account).toEqual(mockAccountModel());
  });

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut();
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError);

    const promise = sut.load(token, role);

    await expect(promise).rejects.toThrow();
  });

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementationOnce(throwError);

    const promise = sut.load(token, role);

    await expect(promise).rejects.toThrow();
  });
});
