export const signUpPath = {
  post: {
    // Qual tag ele pertence criada no arquivo base
    tags: ['Login'],
    summary: 'API to register users',
    requestBody: {
      description: 'SignUp request params',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signUpParams',
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
              $ref: '#/schemas/account',
            },
          },
        },
      },
      400: {
        $ref: '#/components/badRequestResponse',
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
