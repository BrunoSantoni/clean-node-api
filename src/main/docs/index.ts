import {
  badRequestResponse,
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from './components';
import { loginPath, surveyPath } from './paths';
import {
  accountSchema,
  apiKeyAuthSchema,
  errorSchema,
  loginParamsSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema,
} from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API to create and vote on Surveys using Clean Architecture with NodeJS',
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
  }, {
    name: 'Surveys',
  }],
  // Paths = rotas
  paths: {
    '/login': loginPath,
    '/surveys': surveyPath,
  },
  schemas: {
    account: accountSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    surveys: surveysSchema,
    error: errorSchema,
    loginParams: loginParamsSchema,
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema,
    },
    badRequestResponse,
    forbiddenResponse,
    notFoundResponse,
    serverErrorResponse,
    unauthorizedResponse,
  },
};