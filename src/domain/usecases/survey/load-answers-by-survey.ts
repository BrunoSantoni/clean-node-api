export namespace LoadAnswersBySurvey {
  export type Result = string[];
}

export interface LoadAnswersBySurvey {
  loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result>;
}
