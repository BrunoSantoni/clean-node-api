export namespace CheckSurveyById {
  export type Result = boolean;
}

export interface CheckSurveyById {
  checkById (id: string): Promise<CheckSurveyById.Result>;
}
