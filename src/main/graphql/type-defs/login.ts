import { gql } from 'apollo-server-express';

export const login = gql`
  extend type Query {
    # A exclamação indica que é obrigatório
    login (email: String!, password: String!): Account! 
  }

  type Account {
    accessToken: String!
    name: String!
  }
`;
