import { DbAuthentication } from '@/data/usecases';
import {
  EncrypterSpy,
  HashComparerSpy,
  LoadAccountByEmailRepositorySpy,
  UpdateAccessTokenRepositorySpy,
} from '@/tests/data/mocks';
import { mockAuthenticationParams, throwError } from '@/tests/domain/mocks';

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
  hashComparerSpy: HashComparerSpy;
  encrypterSpy: EncrypterSpy;
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy;
};

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  const hashComparerSpy = new HashComparerSpy();
  const encrypterSpy = new EncrypterSpy();
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy,
  );

  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy,
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();

    const authenticationParams = mockAuthenticationParams();
    await sut.auth(authenticationParams);

    expect(loadAccountByEmailRepositorySpy.email).toBe(authenticationParams.email);
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    jest.spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail').mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    loadAccountByEmailRepositorySpy.result = null; // Não retornando nenhuma conta

    const model = await sut.auth(mockAuthenticationParams());
    expect(model).toBeNull();
  });

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy, loadAccountByEmailRepositorySpy } = makeSut();

    // Usou o do e-mail, pois o HashComparer é chamado com a account gerada pelo e-mail,
    // e, se fizéssemos outro mock, ele passaria duas senhas diferentes
    const authenticationParams = mockAuthenticationParams();

    await sut.auth(authenticationParams);

    expect(hashComparerSpy.plaintext).toEqual(authenticationParams.password);
    expect(hashComparerSpy.digest).toEqual(loadAccountByEmailRepositorySpy.result.password);
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

    const model = await sut.auth(mockAuthenticationParams());
    expect(model).toBeNull();
  });

  // Encrypter is the TokenGenerator
  test('Should call Encrypter with correct plaintext', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut();

    const authenticationParams = mockAuthenticationParams();

    await sut.auth(authenticationParams);

    expect(encrypterSpy.plaintext).toBe(loadAccountByEmailRepositorySpy.result.id);
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut();
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const {
      sut, updateAccessTokenRepositorySpy, encrypterSpy, loadAccountByEmailRepositorySpy,
    } = makeSut();

    const authenticationParams = mockAuthenticationParams();
    await sut.auth(authenticationParams);

    expect(updateAccessTokenRepositorySpy.id).toBe(loadAccountByEmailRepositorySpy.result.id);
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.ciphertext);
  });

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut();
    jest.spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken').mockImplementationOnce(throwError);

    const promise = sut.auth(mockAuthenticationParams());
    await expect(promise).rejects.toThrow();
  });

  // No caso de sucesso não mocka nada.
  test('Should return an Authentication.Result on success', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut();

    const { accessToken, name } = await sut.auth(mockAuthenticationParams());

    expect(encrypterSpy.ciphertext).toBe(accessToken);
    expect(loadAccountByEmailRepositorySpy.result.name).toBe(name);
  });
});
