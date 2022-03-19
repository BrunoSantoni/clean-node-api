export const surveyResultPath = {
  put: {
    security: [{
      apiKeyAuth: [],
    }],
    // Qual tag ele pertence criada no arquivo base
    tags: ['Surveys'],
    summary: 'API to save survey results',
    description: 'This route can only be called by authenticated users',
    parameters: [{
      description: 'Survey ID param',
      in: 'path',
      name: 'surveyId',
      required: true,
      schema: {
        type: 'string',
      },
    }],
    requestBody: {
      description: 'Save Survey request params',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveSurveyParams',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult',
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
  get: {
    security: [{
      apiKeyAuth: [],
    }],
    // Qual tag ele pertence criada no arquivo base
    tags: ['Surveys'],
    summary: 'API to load survey results',
    description: 'This route can only be called by authenticated users',
    parameters: [{
      description: 'Survey ID param',
      in: 'path',
      name: 'surveyId',
      required: true,
      schema: {
        type: 'string',
      },
    }],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult',
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
};
