import {
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from './components';
import { loginPath } from './paths';
import { accountSchema, errorSchema, loginParamsSchema } from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API to create and vote on polls using Clean Architecture with NodeJS',
    version: '1.0.0',
  },
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT',
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
    error: errorSchema,
    loginParams: loginParamsSchema,
  },
  components: {
    badRequestResponse,
    notFoundResponse,
    serverErrorResponse,
    unauthorizedResponse,
  },
};
