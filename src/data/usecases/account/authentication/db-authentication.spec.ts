import {
  HashComparer,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from './db-authentication-protocols';
import { DbAuthentication } from './db-authentication';
import {
  EncrypterSpy,
  HashComparerSpy,
  mockLoadAccountByEmailRepository,
  mockUpdateAccessTokenRepository,
} from '@/data/test';
import { mockAuthenticationParams, throwError } from '@/domain/test';

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerSpy: HashComparerSpy;
  encrypterSpy: EncrypterSpy;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository();
  const hashComparerSpy = new HashComparerSpy();
  const encrypterSpy = new EncrypterSpy();
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositoryStub,
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');

    await sut.auth(mockAuthenticationParams());

    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null);

    const accessToken = await sut.auth(mockAuthenticationParams());
    expect(accessToken).toBeNull();
  });

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy } = makeSut();
    const authenticationParams = mockAuthenticationParams();

    await sut.auth(authenticationParams);

    expect(hashComparerSpy.plaintext).toEqual(authenticationParams.password);
    expect(hashComparerSpy.digest).toEqual(authenticationParams.password);
  });

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut();
    jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerSpy } = makeSut();
    hashComparerSpy.isValid = false;

    const accessToken = await sut.auth(mockAuthenticationParams());
    expect(accessToken).toBeNull();
  });

  // Encrypter is the TokenGenerator
  test('Should call Encrypter with correct plaintext', async () => {
    const { sut, encrypterSpy } = makeSut();

    const authenticationParams = mockAuthenticationParams();

    await sut.auth(authenticationParams);

    expect(encrypterSpy.plaintext).toBe('any_id');
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut();
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  // No caso de sucesso não mocka nada.
  test('Should return a token on success', async () => {
    const { sut, encrypterSpy } = makeSut();

    const token = await sut.auth(mockAuthenticationParams());

    expect(encrypterSpy.ciphertext).toBe(token);
  });

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub, encrypterSpy } = makeSut();
    const updateAccessTokenSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken');

    await sut.auth(mockAuthenticationParams());

    expect(updateAccessTokenSpy).toHaveBeenCalledWith('any_id', encrypterSpy.ciphertext);
  });

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });
});
