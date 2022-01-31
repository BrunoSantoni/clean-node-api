import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

/*
Mockando o bcrypt para sempre retornar uma hash fixa,
pois nos testes não estamos interessados em como fazer a hash,
e sim se o método está sendo chamado e repassando a hash corretamente.
*/
jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash'));
  },

  async compare(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

const salt = 12;
const makeSut = (): BcryptAdapter => new BcryptAdapter(salt);

describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt hash with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a valid hash on Bcrypt hash success', async () => {
    const sut = makeSut();
    const hash = await sut.hash('any_value');

    expect(hash).toBe('hash');
  });

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error() as never);
    const promise = sut.hash('any_value');

    await expect(promise).rejects.toThrow();
  });

  test('Should call Bcrypt compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'any_hash');

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });

  test('Should return false when Bcrypt compare fails', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => new Promise((resolve) => resolve(false)));

    const isValid = await sut.compare('any_value', 'any_hash');

    expect(isValid).toBe(false);
  });

  test('Should return true when Bcrypt compare succeeds', async () => {
    const sut = makeSut();

    const isValid = await sut.compare('any_value', 'any_hash');

    expect(isValid).toBe(true);
  });
});
