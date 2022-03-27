import { gql } from 'apollo-server-express';

export const surveyResult = gql`
  extend type Query {
    loadSurveyResult (surveyId: String!): SurveyResult! @auth # Usando a diretiva de auth definida na base
  }

  extend type Mutation {
    saveSurveyResult (surveyId: String!, answer: String!): SurveyResult! @auth
  }

  type SurveyResult {
    surveyId: String!
    question: String!
    answers: [Answer!]!
    date: DateTime!
  }

  type Answer {
    image: String
    answer: String!
    count: Int!
    percent: Int!
    isUserCurrentAnswer: Boolean!
  }
`;
