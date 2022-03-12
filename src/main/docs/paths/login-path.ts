export const loginPath = {
  post: {
    // Qual tag ele pertence criada no arquivo base
    tags: ['Login'],
    summary: 'API to authenticate users',
    requestBody: {
      description: 'Login request params',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParams',
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
    },
  },
};
