import { Decrypter } from '@/data/protocols/cryptography/decrypter';
import { Encrypter } from '@/data/protocols/cryptography/encrypter';
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer';
import { Hasher } from '@/data/protocols/cryptography/hasher';

// Todos os mocks relacionados a protocols/cryptography

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return Promise.resolve('any_password');
    }
  }

  return new HasherStub();
};

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return 'any_token';
    }
  }

  return new EncrypterStub();
};

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return true;
    }
  }

  return new HashComparerStub();
};

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return Promise.resolve('decrypted_value');
    }
  }

  return new DecrypterStub();
};