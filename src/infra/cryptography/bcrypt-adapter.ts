import bcrypt from 'bcrypt';
import { Hasher } from '../../data/protocols/cryptography/hasher';

export class BcryptAdapter implements Hasher {
  /*
  Colocando o salt no construtor, pois o salt é uma propriedade específica
  do bcrypt, não faz sentido adicionar ao protocolo Hasher, visto que algumas
  bibliotecas não esperarão esse parâmetro
  */
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }
}
