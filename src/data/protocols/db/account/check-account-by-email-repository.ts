export namespace CheckAccountByEmailRepository {
  export type Result = boolean;
}

export interface CheckAccountByEmailRepository {
  checkByEmail(email: string): Promise<CheckAccountByEmailRepository.Result>;
}
