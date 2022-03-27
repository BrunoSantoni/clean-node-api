import { GraphQLDateTime } from 'graphql-scalars';

export const base = {
  DateTime: GraphQLDateTime, // Sempre que tiver um DateTime no código, usará a lib para resolver a data
};
