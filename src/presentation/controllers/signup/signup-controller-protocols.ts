// Protocolos (tipos/interfaces) específicos do signup controller

export * from '../../protocols';
export * from '../../../domain/usecases/add-account';
export * from '../../../domain/usecases/authentication';
export * from '../../../domain/models/account';

export type CreateAccountParams = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};
