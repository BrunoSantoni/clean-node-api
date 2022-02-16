import { sign, verify } from 'jsonwebtoken';
import { Decrypter } from '../../../data/protocols/cryptography/decrypter';
import { Encrypter } from '../../../data/protocols/cryptography/encrypter';

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(
    private readonly secret: string,
  ) {}

  async encrypt(value: string): Promise<string> {
    const accessToken = await sign({ id: value }, this.secret);

    return accessToken;
  }

  async decrypt(value: string): Promise<string> {
    const decryptedValue: any = await verify(value, this.secret);
    return decryptedValue;
  }
}
