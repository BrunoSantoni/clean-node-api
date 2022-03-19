import faker from '@faker-js/faker';
import { Decrypter } from '@/data/protocols/cryptography/decrypter';
import { Encrypter } from '@/data/protocols/cryptography/encrypter';
import { HashComparer } from '@/data/protocols/cryptography/hash-comparer';
import { Hasher } from '@/data/protocols/cryptography/hasher';

// Todos os mocks relacionados a protocols/cryptography

export class HasherSpy implements Hasher {
  digest = faker.datatype.uuid(); // Retorno forçado

  plaintext: string; // Parâmetro recebido

  async hash(plaintext: string): Promise<string> {
    this.plaintext = plaintext;
    return Promise.resolve(this.digest);
  }
}

export class EncrypterSpy implements Encrypter {
  ciphertext = faker.datatype.uuid();

  plaintext: string;

  async encrypt(plaintext: string): Promise<string> {
    this.plaintext = plaintext;
    return Promise.resolve(this.ciphertext);
  }
}

export class HashComparerSpy implements HashComparer {
  plaintext: string;

  digest: string;

  isValid = true;

  async compare(plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext;
    this.digest = digest;

    return Promise.resolve(this.isValid);
  }
}

export class DecrypterSpy implements Decrypter {
  ciphertext: string;

  plaintext = faker.internet.password();

  async decrypt(ciphertext: string): Promise<string> {
    this.ciphertext = ciphertext;

    return Promise.resolve(this.plaintext);
  }
}
