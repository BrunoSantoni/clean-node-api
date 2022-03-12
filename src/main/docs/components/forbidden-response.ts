export const forbiddenResponse = {
  description: 'Access Denied',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error',
      },
    },
  },
};
