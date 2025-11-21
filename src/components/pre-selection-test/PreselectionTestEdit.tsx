"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  X,
  Pencil,
  Save,
  BookOpen,
  Clock,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  fetchTestConfig,
  upsertTestConfig,
  deleteQuestion,
} from "@/service/preselectionTest.Service"; // pastikan path sesuai
import { Question, TestConfig } from "@/types/preSelectionTest.types"; // tipe data sesuai backend

// --- KONSTANTA ---
const JOB_ID = 101;
const MAX_QUESTIONS = 25;
const OPTION_LABELS = ["A", "B", "C", "D"];

const INITIAL_TEST_CONFIG: TestConfig = {
  testId: null,
  jobId: JOB_ID,
  title: `Test Lowongan ${JOB_ID}`,
  status: "draft",
  questions: [],
  totalQuestions: 0,
};

// --- MODAL REUSABLE ---
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all scale-100 p-6">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 rounded-full transition duration-150"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- FORMULIR PERTANYAAN ---
const QuestionForm: React.FC<{
  initialQuestion: Question | null;
  onSave: (q: Question) => void;
  onCancel: () => void;
  currentQuestionCount: number;
  isEdit: boolean;
}> = ({ initialQuestion, onSave, onCancel, currentQuestionCount, isEdit }) => {
  const [questionText, setQuestionText] = useState(
    initialQuestion?.question || ""
  );
  const [options, setOptions] = useState(
    initialQuestion?.options || ["", "", "", ""]
  );
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<0 | 1 | 2 | 3>(
    initialQuestion?.correctAnswer || 0
  );
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isEdit && currentQuestionCount >= MAX_QUESTIONS) {
      setError(`Maksimal ${MAX_QUESTIONS} pertanyaan tercapai.`);
      return;
    }

    if (questionText.trim() === "") {
      setError("Teks pertanyaan tidak boleh kosong.");
      return;
    }

    if (options.some((opt) => opt.trim() === "")) {
      setError("Semua 4 opsi jawaban harus diisi.");
      return;
    }

    const newQuestion: Question = {
      id: initialQuestion ? initialQuestion.id : Date.now(),
      dbId: initialQuestion?.dbId,
      question: questionText.trim(),
      options: options.map((opt) => opt.trim()) as [
        string,
        string,
        string,
        string
      ],
      correctAnswer: correctAnswerIndex,
    };

    onSave(newQuestion);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options] as [string, string, string, string];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
          <XCircle size={18} className="mr-2" /> {error}
        </div>
      )}

      <label className="block">
        <span className="text-sm font-medium text-gray-700">Pertanyaan</span>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 transition"
          rows={3}
          placeholder="Masukkan teks pertanyaan di sini..."
          required
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <label key={index} className="block relative">
            <span
              className={`text-sm font-medium ${
                correctAnswerIndex === index
                  ? "text-sky-600 font-semibold"
                  : "text-gray-700"
              }`}
            >
              Opsi {OPTION_LABELS[index]}
            </span>
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className={`mt-1 w-full p-3 border rounded-lg shadow-sm transition ${
                correctAnswerIndex === index
                  ? "border-sky-500 ring-2 ring-sky-200"
                  : "border-gray-300 focus:ring-sky-500 focus:border-sky-500"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setCorrectAnswerIndex(index as 0 | 1 | 2 | 3)}
              className={`absolute top-0 right-0 m-1.5 p-1 rounded-full text-xs font-bold ${
                correctAnswerIndex === index
                  ? "bg-sky-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-600 hover:bg-sky-500 hover:text-white"
              }`}
              title="Set as Correct Answer"
            >
              <BookOpen size={16} />
            </button>
          </label>
        ))}
      </div>

      <div className="pt-4 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150 shadow-sm"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition duration-150 disabled:bg-sky-300"
          disabled={!isEdit && currentQuestionCount >= MAX_QUESTIONS}
        >
          <Save size={18} className="inline mr-2" />
          {isEdit ? "Simpan Perubahan" : "Tambah Pertanyaan"}
        </button>
      </div>
    </form>
  );
};

// --- KARTU PERTANYAAN ---
const QuestionCard: React.FC<{
  question: Question;
  index: number;
  onEdit: (q: Question) => void;
  onDelete: (id: number) => void;
}> = ({ question, index, onEdit, onDelete }) => {
  const isCorrect = (optionIndex: number) =>
    question.correctAnswer === optionIndex;

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-lg font-bold text-gray-800">Soal #{index + 1}</h4>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(question)}
            className="p-2 text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-lg transition duration-150 shadow-sm"
            title="Edit Soal"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDelete(question.id)}
            className="p-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition duration-150 shadow-sm"
            title="Hapus Soal"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <p className="mb-4 text-gray-700 whitespace-pre-wrap">
        {question.question}
      </p>

      <ul className="space-y-2">
        {question.options.map((option, optionIndex) => (
          <li
            key={optionIndex}
            className={`p-3 rounded-lg text-sm transition ${
              isCorrect(optionIndex)
                ? "bg-green-100 text-green-800 font-semibold border border-green-300"
                : "bg-gray-50 text-gray-700 border border-gray-200"
            }`}
          >
            <span className="font-bold mr-2">
              {OPTION_LABELS[optionIndex]}.
            </span>
            {option}
            {isCorrect(optionIndex) && (
              <span className="ml-2 inline-flex items-center text-xs text-green-700">
                (Jawaban Benar)
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- KOMPONEN UTAMA ---
const PreselectionTestEdit: React.FC = () => {
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Pesan
  const showMessage = (message: string, isError = false) => {
    if (isError) {
      setError(message);
      setSuccessMessage(null);
    } else {
      setSuccessMessage(message);
      setError(null);
    }
    setTimeout(() => {
      setSuccessMessage(null);
      setError(null);
    }, 5000);
  };

  // Fetch config
  const loadTestConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTestConfig(JOB_ID);
      setTestConfig(data);
    } catch (err: any) {
      console.error(err);
      setError("Gagal memuat konfigurasi tes.");
      setTestConfig(INITIAL_TEST_CONFIG);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTestConfig();
  }, [loadTestConfig]);

  // Save test
  const handleSaveTest = async (
    newStatus?: "draft" | "published",
    title?: string
  ) => {
    if (!testConfig) return;

    const hasEmptyQuestion = testConfig.questions.some(
      (q) =>
        q.question.trim() === "" || q.options.some((opt) => opt.trim() === "")
    );

    if (hasEmptyQuestion) {
      showMessage("Pastikan semua soal terisi lengkap.", true);
      return;
    }

    const configToSave: TestConfig = {
      ...testConfig,
      status: newStatus ?? testConfig.status,
      title: title ?? testConfig.title,
    };

    if (newStatus === "published" && configToSave.questions.length === 0) {
      showMessage("Tidak dapat mem-publish tes tanpa soal.", true);
      return;
    }

    setIsSaving(true);
    try {
      const updatedConfig = await upsertTestConfig(configToSave);
      setTestConfig(updatedConfig);
      showMessage(
        `Tes berhasil di${newStatus === "published" ? "publish" : "simpan"}!`
      );
    } catch (err: any) {
      console.error(err);
      showMessage(`Gagal menyimpan tes: ${err.message}`, true);
    } finally {
      setIsSaving(false);
    }
  };

  // Add/Edit/Delete question
  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleQuestionSubmit = (newOrUpdatedQuestion: Question) => {
    if (!testConfig) return;

    let updatedQuestions: Question[] = editingQuestion
      ? testConfig.questions.map((q) =>
          q.id === newOrUpdatedQuestion.id ? newOrUpdatedQuestion : q
        )
      : [...testConfig.questions, newOrUpdatedQuestion];

    setTestConfig({
      ...testConfig,
      questions: updatedQuestions,
      totalQuestions: updatedQuestions.length,
    });
    setIsModalOpen(false);
    setEditingQuestion(null);

    handleSaveTest(testConfig.status);
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!testConfig || !window.confirm("Hapus pertanyaan ini?")) return;

    try {
      await deleteQuestion(questionId);
      const updatedQuestions = testConfig.questions.filter(
        (q) => q.id !== questionId
      );
      setTestConfig({
        ...testConfig,
        questions: updatedQuestions,
        totalQuestions: updatedQuestions.length,
      });
      showMessage("Pertanyaan berhasil dihapus!");
    } catch (err: any) {
      console.error(err);
      showMessage("Gagal menghapus pertanyaan.", true);
    }
  };

  const isTestPublished = testConfig?.status === "published";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex items-center space-x-2 text-sky-600">
          <Clock size={24} className="animate-spin" />
          <span className="text-xl font-medium">Memuat Konfigurasi Tes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {/* HEADER */}
      <header className="mb-8 bg-white p-6 rounded-xl shadow-lg border-t-4 border-sky-600">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Manajemen Soal Pra-Seleksi
        </h1>
        <p className="text-gray-600">
          Konfigurasi Tes untuk Lowongan: {testConfig?.jobId}
        </p>
      </header>

      {/* STATUS & AKSI */}
      <section className="mb-8 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Status Tes</h2>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-3">
            <span
              className={`px-4 py-2 font-semibold rounded-full text-white shadow-md ${
                isTestPublished ? "bg-green-600" : "bg-yellow-600"
              }`}
            >
              Status: {isTestPublished ? "PUBLISHED" : "DRAFT"}
            </span>
            <span className="text-gray-600 font-medium">
              Total Soal: {testConfig?.questions.length} / {MAX_QUESTIONS}
            </span>
          </div>

          <div className="flex space-x-3">
            {isTestPublished ? (
              <button
                onClick={() => handleSaveTest("draft")}
                disabled={isSaving}
                className="px-5 py-2 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700 transition duration-150 disabled:bg-gray-400"
              >
                {isSaving ? "Menyimpan..." : "Set ke Draft"}
              </button>
            ) : (
              <button
                onClick={() => handleSaveTest("published")}
                disabled={isSaving || testConfig?.questions.length === 0}
                className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-150 disabled:bg-gray-400"
              >
                {isSaving ? "Mem-publish..." : "Publish Test"}
              </button>
            )}
            <button
              onClick={handleAddQuestion}
              disabled={
                isSaving ||
                (testConfig?.questions?.length ?? 0) >= MAX_QUESTIONS
              }
              className="px-5 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition duration-150 disabled:bg-gray-400"
            >
              <Plus size={18} className="inline mr-1" />
              Tambah Soal
            </button>
          </div>
        </div>
      </section>

      {/* Pesan */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg shadow-md flex items-center">
          <BookOpen size={20} className="mr-2" />
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg shadow-md flex items-center">
          <XCircle size={20} className="mr-2" />
          {error}
        </div>
      )}

      {/* Daftar Pertanyaan */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Daftar Pertanyaan ({testConfig?.questions.length})
      </h2>

      <div className="space-y-6">
        {testConfig?.questions.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-xl shadow-lg border border-dashed border-gray-300">
            <Clock size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="text-lg text-gray-500">
              Belum ada pertanyaan. Silakan klik "Tambah Soal".
            </p>
          </div>
        ) : (
          testConfig?.questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
            />
          ))
        )}
      </div>

      {/* MODAL FORM */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuestion(null);
        }}
        title={editingQuestion ? "Edit Pertanyaan" : "Tambah Pertanyaan"}
      >
        <QuestionForm
          initialQuestion={editingQuestion}
          onSave={handleQuestionSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingQuestion(null);
          }}
          currentQuestionCount={testConfig?.questions.length || 0}
          isEdit={!!editingQuestion}
        />
      </Modal>
    </div>
  );
};

export default PreselectionTestEdit;
