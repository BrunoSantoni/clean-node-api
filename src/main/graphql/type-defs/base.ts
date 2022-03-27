import { gql } from 'apollo-server-express';

export const base = gql`
  scalar DateTime # Scalar é um tipo customizado que foi criado, a aplicação dele está no base dos resolvers

  directive @auth on FIELD_DEFINITION

  type Query {
    _: String
  }

  type Mutation {
    _: String
  }
`;
