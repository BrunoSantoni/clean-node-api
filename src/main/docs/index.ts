import { loginPath } from './paths';
import { accountSchema, loginParamsSchema } from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API to create and vote on polls using Clean Architecture with NodeJS',
    version: '1.0.0',
  },
  servers: [{
    url: '/api', // Prefixo da URL da aplicação
  }],
  // Tags agrupam as rotas da API
  tags: [{
    name: 'Login',
  }],
  // Paths = rotas
  paths: {
    '/login': loginPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
  },
};
