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

describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt with correct values', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a hash on success', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hash = await sut.encrypt('any_value');

    expect(hash).toBe('hash');
  });
});
