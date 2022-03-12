import {
  loginPath, signUpPath, surveyPath, surveyResultPath,
} from '../paths/index';

export const pathsHelper = {
  '/login': loginPath,
  '/signup': signUpPath,
  '/surveys': surveyPath,
  '/surveys/{surveyId}/results': surveyResultPath,
};
