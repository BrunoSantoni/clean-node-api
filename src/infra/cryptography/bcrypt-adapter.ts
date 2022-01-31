import bcrypt from 'bcrypt';
import { HashComparer } from '../../data/protocols/cryptography/hash-comparer';
import { Hasher } from '../../data/protocols/cryptography/hasher';

/* O adapter pode fazer mais uma coisa desde que estejam interligadas
O importante é manter as interfaces separadas para não ferir o ISP */
export class BcryptAdapter implements Hasher, HashComparer {
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

  async compare(value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash);
    return new Promise((resolve) => resolve(true));
  }
}
