import { gql } from 'apollo-server-express';

export const survey = gql`
  extend type Query {
    surveys: [Survey!]! @auth # Usando a diretiva de auth definida na base
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
