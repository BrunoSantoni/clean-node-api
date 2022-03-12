import {
  badRequestResponse,
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from './components';
import {
  loginPath, signUpPath, surveyPath, surveyResultPath,
} from './paths';
import {
  accountSchema,
  apiKeyAuthSchema,
  errorSchema,
  signUpParamsSchema,
  loginParamsSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema,
  addSurveyParamsSchema,
  saveSurveyParamsSchema,
  surveyResultSchema,
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
  tags: [
    {
      name: 'Login',
    },
    {
      name: 'Surveys',
    },
  ],
  // Paths = rotas
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveyPath,
    '/surveys/{surveyId}/results': surveyResultPath,
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    signUpParams: signUpParamsSchema,
    error: errorSchema,
    addSurveyParams: addSurveyParamsSchema,
    saveSurveyParams: saveSurveyParamsSchema,
    survey: surveySchema,
    surveys: surveysSchema,
    surveyAnswer: surveyAnswerSchema,
    surveyResult: surveyResultSchema,
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
