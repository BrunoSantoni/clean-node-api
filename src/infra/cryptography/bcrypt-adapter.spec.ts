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
}));

const salt = 12;
const makeSut = (): BcryptAdapter => new BcryptAdapter(salt);

describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a hash on success', async () => {
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
});
