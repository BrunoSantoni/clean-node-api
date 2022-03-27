import { gql } from 'apollo-server-express';

export const survey = gql`
  extend type Query {
    surveys: [Survey!]! # Survey não pode ser nulo e o array tem que existir
  }

  type Survey {
    id: ID!
    question: String!
    answers: [SurveyAnswer!]!
    date: DateTime!
    didAnswer: Boolean
  }

  type SurveyAnswer {
    image: String
    answer: String!
  }
`;
