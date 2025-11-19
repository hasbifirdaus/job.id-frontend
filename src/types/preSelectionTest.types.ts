export type QuestionOption = "A" | "B" | "C" | "D";

export interface Question {
  id: number;
  dbId?: number;
  question: string;
  options: [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
}

export interface TestConfig {
  testId: number | null;
  jobId: number;
  title: string;
  status: "draft" | "published";
  questions: Question[];
  totalQuestions: number;
}

export type TestStatus = "published" | "draft";

export interface PreSelectionTestResponse {
  title: string;
  status: TestStatus;
  questions: Question[];
}

export interface QuestionForApplicant {
  question_id: number;
  question: string;
  options: Record<QuestionOption, string>;
}

export interface TestForApplicant {
  testId: number;
  title: string;
  questions: QuestionForApplicant[];
  totalQuestions: number;
}
