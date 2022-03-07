// Protocolos (tipos/interfaces) específicos do signup controller

export * from '@/domain/usecases/account/add-account';
export * from '@/domain/usecases/account/authentication';
export * from '@/domain/models/account';
export * from '@/presentation/protocols';

export type CreateAccountParams = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};
