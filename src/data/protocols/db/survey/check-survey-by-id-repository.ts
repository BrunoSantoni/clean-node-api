export namespace CheckSurveyByIdRepository {
  export type Result = boolean;
}

export interface CheckSurveyByIdRepository {
  checkById(id: string): Promise<CheckSurveyByIdRepository.Result>;
}
