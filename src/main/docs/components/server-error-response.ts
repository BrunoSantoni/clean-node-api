export const serverErrorResponse = {
  description: 'Internal Server Error',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error',
      },
    },
  },
};
