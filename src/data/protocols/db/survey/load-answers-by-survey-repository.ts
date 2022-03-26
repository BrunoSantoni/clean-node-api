export namespace LoadAnswersBySurveyRepository {
  export type Result = string[];
}

export interface LoadAnswersBySurveyRepository {
  loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Result>;
}
