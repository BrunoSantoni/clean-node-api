type SurveyAnswerModel = {
  image?: string;
  answer: string;
};

export type SurveyModel = {
  id: string;
  didUserAnswered?: boolean;
  question: string;
  answers: SurveyAnswerModel[];
  date: Date;
};
