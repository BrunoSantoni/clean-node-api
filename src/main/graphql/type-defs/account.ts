import { gql } from 'apollo-server-express';

export const account = gql`
  extend type Query {
    # A exclamação indica que é obrigatório
    login (email: String!, password: String!): Account! 
  }

  extend type Mutation {
    signUp (name: String!, email: String!, password: String!, passwordConfirmation: String!): Account! 
  }

  type Account {
    accessToken: String!
    name: String!
  }
`;
