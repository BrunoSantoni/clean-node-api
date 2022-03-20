import bcrypt from 'bcrypt';
import { Hasher, HashComparer } from './bcrypt-adapter-protocols';

/* O adapter pode fazer mais uma coisa desde que estejam interligadas
O importante é manter as interfaces separadas para não ferir o ISP */
export class BcryptAdapter implements Hasher, HashComparer {
  /*
  Colocando o salt no construtor, pois o salt é uma propriedade específica
  do bcrypt, não faz sentido adicionar ao protocolo Hasher, visto que algumas
  bibliotecas não esperarão esse parâmetro
  */
  constructor(private readonly salt: number) {}

  async hash(plaintext: string): Promise<string> {
    const digest = await bcrypt.hash(plaintext, this.salt);
    return digest;
  }

  async compare(plaintext: string, digest: string): Promise<boolean> {
    const isValid = await bcrypt.compare(plaintext, digest);
    return isValid;
  }
}
