// lib/validation/preSelection.ts
import * as yup from "yup";
import { QuestionOption } from "@/types/preSelection.types";

export const preSelectionTestSchema = yup.object().shape({
  title: yup.string().required("Test title is required"),
  questions: yup
    .array()
    .of(
      yup.object().shape({
        question: yup.string().required("Question is required"),
        option_a: yup.string().required("Option A is required"),
        option_b: yup.string().required("Option B is required"),
        option_c: yup.string().required("Option C is required"),
        option_d: yup.string().required("Option D is required"),
        correct_answer: yup
          .mixed<QuestionOption>()
          .oneOf(["A", "B", "C", "D"])
          .required("Correct answer is required"),
      })
    )
    .min(1, "At least one question is required")
    .max(25, "Maximum 25 questions allowed")
    .required("Questions are required"),
});
