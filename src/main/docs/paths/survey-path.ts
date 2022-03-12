export const surveyPath = {
  get: {
    // Se colocar o security na raíz, aplicará em todas as rotas
    security: [{
      apiKeyAuth: [],
    }],
    // Qual tag ele pertence criada no arquivo base
    tags: ['Surveys'],
    summary: 'API to list all surveys',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys',
            },
          },
        },
      },
      403: {
        $ref: '#/components/forbiddenResponse',
      },
      404: {
        $ref: '#/components/notFoundResponse',
      },
      500: {
        $ref: '#/components/serverErrorResponse',
      },
    },
  },
  post: {
    // Se colocar o security na raíz, aplicará em todas as rotas
    security: [{
      apiKeyAuth: [],
    }],
    // Qual tag ele pertence criada no arquivo base
    tags: ['Surveys'],
    summary: 'API to create a survey',
    requestBody: {
      description: 'Add survey request params',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/addSurveyParams',
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Survey successfully created',
      },
      403: {
        $ref: '#/components/forbiddenResponse',
      },
      404: {
        $ref: '#/components/notFoundResponse',
      },
      500: {
        $ref: '#/components/serverErrorResponse',
      },
    },
  },
};
