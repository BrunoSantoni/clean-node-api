export const unauthorizedResponse = {
  description: 'Invalid Credentials',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error',
      },
    },
  },
};
