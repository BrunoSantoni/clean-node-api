import bcrypt from 'bcrypt';
import { Encrypter } from '../../data/protocols/encrypter';

export class BcryptAdapter implements Encrypter {
  /*
  Colocando o salt no construtor, pois o salt é uma propriedade específica
  do bcrypt, não faz sentido adicionar ao protocolo Encrypter, visto que algumas
  bibliotecas não esperarão esse parâmetro
  */
  constructor(private readonly salt: number) {}

  async encrypt(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }
}
