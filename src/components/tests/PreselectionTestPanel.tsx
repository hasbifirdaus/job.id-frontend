"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2, FileText, Plus } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import QuestionCard from "../test/QuestionCard";
import StatusBar from "../test/StatusBar";
import TestTitleInput from "../test/TestTitleInput";
import {
  Question,
  TestStatus,
  PreSelectionTestResponse,
} from "@/types/preSelectionTest.types";
import ResultsSection from "../test/ResultSection";

const createNewQuestion = (id: number): Question => ({
  id,
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
});

interface PreSelectionTestPanelProps {
  jobId: string;
}

const PreSelectionTestPanel: React.FC<PreSelectionTestPanelProps> = ({
  jobId,
}) => {
  const [mode, setMode] = useState<"results" | "creation" | "preview">(
    "creation"
  );
  const [testTitle, setTestTitle] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([
    createNewQuestion(1),
  ]);
  const [testStatus, setTestStatus] = useState<TestStatus>("draft");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch Tes ---
  const fetchTest = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get<PreSelectionTestResponse>(
        `/preselectiontest/${Number(jobId)}/test/results`
      );
      setQuestions(res.data.questions || [createNewQuestion(1)]);
      setTestStatus(res.data.status || "draft");
      setTestTitle(res.data.title || "");
    } catch (e: any) {
      console.error(e);
      setQuestions([createNewQuestion(1)]);
      setTestStatus("draft");
      setTestTitle("");
      setError(e.response?.data?.message || "Gagal memuat data tes.");
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchTest();
  }, [fetchTest]);

  // --- Tambah / Hapus / Commit Soal ---
  const addQuestion = useCallback(() => {
    if (questions.length >= 25) {
      alert("Batas maksimum adalah 25 pertanyaan.");
      return;
    }
    setQuestions((prev) => [
      ...prev,
      createNewQuestion(prev.length > 0 ? prev[prev.length - 1].id + 1 : 1),
    ]);
  }, [questions.length]);

  const deleteQuestion = useCallback((id: number) => {
    setQuestions((prev) => {
      if (prev.length <= 1) {
        alert("Tidak bisa hapus soal terakhir.");
        return prev;
      }
      if (window.confirm("Apakah kamu yakin mau hapus soal ini?"))
        return prev.filter((q) => q.id !== id);
      return prev;
    });
  }, []);

  const commitQuestion = useCallback((updated: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q))
    );
  }, []);

  // --- Simpan Tes ---
  const saveTest = useCallback(
    async (
      title: string,
      questionsToSave: Question[],
      newStatus: TestStatus
    ) => {
      setIsSaving(true);
      setError(null);
      try {
        await axiosClient.post(`/preselectiontest/${jobId}/test`, {
          title,
          questions: questionsToSave,
          status: newStatus,
        });
        setTestStatus(newStatus);
        alert(
          `Tes berhasil ${
            newStatus === "published" ? "diaktifkan" : "disimpan"
          }!`
        );
        return true;
      } catch (e: any) {
        console.error(e);
        setError(e.response?.data?.message || "Gagal menyimpan tes.");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [jobId]
  );

  // --- Nonaktifkan Tes ---
  const disableTest = useCallback(async () => {
    if (!window.confirm("Apakah Anda yakin ingin menonaktifkan tes ini?"))
      return false;
    setIsSaving(true);
    setError(null);
    try {
      await axiosClient.patch(`/preselectiontest/${jobId}/test/status/disable`);
      setTestStatus("draft");
      alert("Tes berhasil dinonaktifkan!");
      return true;
    } catch (e: any) {
      console.error(e);
      setError(e.response?.data?.message || "Gagal menonaktifkan tes.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [jobId]);

  // --- Handle Save dari UI ---
  const handleSaveOrUpdateTest = async () => {
    if (testTitle.trim() === "") {
      alert("Gagal! Judul Tes tidak boleh kosong.");
      return;
    }
    if (questions.length === 0) {
      alert("Gagal! Tes tidak boleh kosong.");
      return;
    }
    if (
      !questions.every(
        (q) =>
          q.question.trim() !== "" &&
          q.options.every((opt) => opt.trim() !== "")
      )
    ) {
      alert("Gagal! Pastikan semua soal dan opsi terisi.");
      return;
    }
    await saveTest(testTitle, questions, "published");
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 mr-3 animate-spin text-indigo-600" />
        <p className="text-lg text-gray-600">Memuat konfigurasi tes...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <h4 className="font-bold mb-1">Terjadi Kesalahan!</h4>
        <p>{error}</p>
        <button
          onClick={fetchTest}
          className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Coba Muat Ulang
        </button>
      </div>
    );

  return (
    <div className="p-4 space-y-4">
      {/* Mode Switch */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setMode("results")}
          className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
            mode === "results"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FileText className="w-4 h-4 mr-2" /> Hasil Tes
        </button>

        <button
          onClick={() => setMode("creation")}
          className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
            mode === "creation"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Plus className="w-4 h-4 mr-2" /> Buat Soal
        </button>

        <button
          onClick={() => setMode("preview")}
          className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center ${
            mode === "preview"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FileText className="w-4 h-4 mr-2" /> Preview/Edit
        </button>
      </div>

      {/* MODE CREATION */}
      {mode === "creation" && (
        <div className="space-y-6">
          <StatusBar
            status={testStatus}
            onDisable={disableTest}
            isSaving={isSaving}
          />
          <TestTitleInput title={testTitle} setTitle={setTestTitle} />
          {questions.map((q, index) => (
            <QuestionCard
              key={q.id}
              q={q}
              index={index}
              totalCount={questions.length}
              onDelete={deleteQuestion}
              onAdd={addQuestion}
              onCommit={commitQuestion}
            />
          ))}
          <button
            onClick={handleSaveOrUpdateTest}
            disabled={isSaving}
            className="w-full py-3 text-white font-semibold rounded-lg mt-6 bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              "Simpan dan Aktifkan Tes"
            )}
          </button>
        </div>
      )}

      {/* MODE PREVIEW/EDIT */}
      {mode === "preview" && (
        <div className="space-y-6">
          <StatusBar
            status={testStatus}
            onDisable={disableTest}
            isSaving={isSaving}
          />
          <TestTitleInput title={testTitle} setTitle={setTestTitle} />
          {questions.map((q, index) => (
            <QuestionCard
              key={q.id}
              q={q}
              index={index}
              totalCount={questions.length}
              onDelete={deleteQuestion}
              onAdd={addQuestion}
              onCommit={commitQuestion}
            />
          ))}
          <button
            onClick={handleSaveOrUpdateTest}
            disabled={isSaving}
            className="w-full py-3 text-white font-semibold rounded-lg mt-6 bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              "Simpan Perubahan"
            )}
          </button>
          <button
            onClick={disableTest}
            disabled={isSaving}
            className="w-full py-3 text-white font-semibold rounded-lg mt-2 bg-red-600 hover:bg-red-700 flex items-center justify-center"
          >
            Nonaktifkan Tes
          </button>
        </div>
      )}
      {mode === "results" && <ResultsSection jobId={jobId} />}
    </div>
  );
};

export default PreSelectionTestPanel;
