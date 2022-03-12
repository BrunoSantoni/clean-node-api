// Indicando que é um array de surveys
export const surveysSchema = {
  type: 'array',
  items: {
    $ref: '#/schemas/survey',
  },
};
