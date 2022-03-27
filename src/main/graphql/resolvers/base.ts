import { GraphQLDateTime } from 'graphql-iso-date';

export const base = {
  DateTime: GraphQLDateTime, // Sempre que tiver um DateTime no código, usará a lib para resolver a data
};
