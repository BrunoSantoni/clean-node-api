// Protocolos (tipos/interfaces) específicos do signup controller

export * from '@/domain/usecases';
export * from '@/domain/models';
export * from '@/presentation/protocols';

export type CreateAccountParams = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};
