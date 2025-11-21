export type QuestionOption = "A" | "B" | "C" | "D";

export interface ICreateQuestionInput {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: QuestionOption;
}

export interface ICreateTestInput {
  job_id: number;
  title: string;
  questions: ICreateQuestionInput[];
  status?: "draft" | "published";
}

export interface ICreateTestFormInput {
  title: string;
  questions: ICreateQuestionInput[];
}

export interface IQuestion {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

export interface IPreSelectionTest {
  id: number;
  title: string;
  questions: IQuestion[];
}

export interface ISubmitResult {
  score: number;
}

export interface Question {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}
