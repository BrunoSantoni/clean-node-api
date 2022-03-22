import faker from '@faker-js/faker';
import {
  Decrypter, Encrypter, HashComparer, Hasher,
} from '@/data/protocols';

// Todos os mocks relacionados a protocols/cryptography

export class HasherSpy implements Hasher {
  plaintext: string; // Parâmetro recebido

  digest = faker.datatype.uuid(); // Retorno forçado

  async hash(plaintext: string): Promise<string> {
    this.plaintext = plaintext;
    return Promise.resolve(this.digest);
  }
}

export class EncrypterSpy implements Encrypter {
  plaintext: string; // Input sempre indicando o tipo

  ciphertext = faker.datatype.uuid(); // Retorno sempre mockando um valor

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
