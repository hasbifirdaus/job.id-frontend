"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import QuestionCard from "@/components/pre-selection-test/QuestionCard";
import ResultModal from "@/components/pre-selection-test/ResultModal";
import {
  TestForApplicant,
  QuestionForApplicant,
  QuestionOption,
} from "@/types/preSelectionTest.types";

const PreSelectionTestPage = () => {
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId;

  const [test, setTest] = useState<TestForApplicant | null>(null);
  const [answers, setAnswers] = useState<Record<number, QuestionOption>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<null | {
    score: number;
    correctAnswers: number;
    totalQuestions: number;
  }>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) return;
    axiosClient
      .get<TestForApplicant>(`/preselectiontest/${jobId}/test/applicant`)
      .then((res) => setTest(res.data))
      .catch((err: any) =>
        setError(err.response?.data?.message || "Gagal mengambil tes")
      );
  }, [jobId]);

  const handleSelectAnswer = (questionId: number, option: QuestionOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (!test) return;
    if (Object.keys(answers).length !== test.totalQuestions) {
      alert("Anda harus menjawab semua pertanyaan.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await axiosClient.post<{
        message: string;
        data: {
          score: number;
          correctAnswers: number;
          totalQuestions: number;
        };
      }>(`/preselectiontest/${jobId}/test/submit`, {
        testId: test.testId,
        answers: Object.entries(answers).map(([question_id, user_answer]) => ({
          question_id: Number(question_id),
          user_answer,
        })),
      });

      setResult({
        score: res.data.data.score, // langsung angka, tanpa persen
        correctAnswers: res.data.data.correctAnswers,
        totalQuestions: res.data.data.totalQuestions,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal submit tes");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!test) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-blue-300">
      <h1 className="text-2xl font-bold mb-6">{test.title}</h1>

      {test.questions.map((q) => (
        <QuestionCard
          key={q.question_id}
          question={q}
          selectedAnswer={answers[q.question_id] || null}
          onSelectAnswer={(option) => handleSelectAnswer(q.question_id, option)}
        />
      ))}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-4 bg-blue-700 text-white px-6 py-2 rounded-lg"
      >
        {isSubmitting ? "Mengirim..." : "Submit Tes"}
      </button>

      {result && (
        <ResultModal
          score={result.score}
          correctAnswers={result.correctAnswers}
          totalQuestions={result.totalQuestions}
          onClose={() => router.push(`/jobs/${jobId}`)}
        />
      )}
    </div>
  );
};

export default PreSelectionTestPage;
