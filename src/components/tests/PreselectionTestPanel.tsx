import React, { useState } from "react";
import { Plus, CheckCircle, ListTodo, FileText } from "lucide-react";

interface PreSelectionTestPanelProps {
  jobId: string;
}

// Data dummy untuk hasil tes
interface TestResult {
  applicantName: string;
  score: number;
  isPassed: boolean;
  testDate: string;
}

const DUMMY_RESULTS: TestResult[] = [
  {
    applicantName: "Budi Santoso",
    score: 85,
    isPassed: true,
    testDate: "2025-10-25",
  },
  {
    applicantName: "Sarah Lestari",
    score: 55,
    isPassed: false,
    testDate: "2025-10-26",
  },
  {
    applicantName: "Rizky Alamsyah",
    score: 92,
    isPassed: true,
    testDate: "2025-10-27",
  },
];

const PreSelectionTestPanel: React.FC<PreSelectionTestPanelProps> = ({
  jobId,
}) => {
  // State untuk beralih antara mode (Creation: membuat soal, Results: melihat hasil)
  const [mode, setMode] = useState<"results" | "creation">("results");

  // State dummy untuk soal yang sedang dibuat (25 pertanyaan multiple choice)
  const [questions, setQuestions] = useState(
    Array(25)
      .fill(null)
      .map((_, i) => ({
        id: i + 1,
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0, // index 0-3
      }))
  );

  // === Komponen 1: Form Pembuatan Soal (Test Creation) ===
  const TestCreationForm = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold border-b pb-3 mb-4 flex items-center">
        <ListTodo className="w-5 h-5 mr-2 text-indigo-600" /> Buat Soal Tes (25
        Pertanyaan)
      </h3>

      {questions.map((q, index) => (
        <div
          key={q.id}
          className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm space-y-3"
        >
          <label className="block text-sm font-medium text-gray-700">
            Pertanyaan #{q.id}
          </label>
          <textarea
            placeholder="Masukkan teks pertanyaan di sini..."
            rows={2}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
            // Tambahkan handler untuk menyimpan input ke state
          />

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Opsi Jawaban:</p>
            {q.options.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`correct-answer-${q.id}`}
                  checked={q.correctAnswer === optIndex}
                  // Tambahkan handler untuk mengatur jawaban benar
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder={`Opsi ${String.fromCharCode(65 + optIndex)}`}
                  className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150">
        Simpan dan Aktifkan Tes
      </button>
    </div>
  );

  // === Komponen 2: Tampilan Hasil Tes (Test Results) ===
  const TestResultsDisplay = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold border-b pb-3 mb-4 flex items-center">
        <CheckCircle className="w-5 h-5 mr-2 text-green-600" /> Hasil Tes
        Pelamar
      </h3>

      {/* Ringkasan Status */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-800">
            {DUMMY_RESULTS.length}
          </p>
          <p className="text-sm text-blue-600">Pelamar Menyelesaikan Tes</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-800">
            {DUMMY_RESULTS.filter((r) => r.isPassed).length}
          </p>
          <p className="text-sm text-green-600">Lulus Seleksi</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-2xl font-bold text-red-800">
            {DUMMY_RESULTS.filter((r) => !r.isPassed).length}
          </p>
          <p className="text-sm text-red-600">Tidak Lulus</p>
        </div>
      </div>

      {/* Tabel Hasil */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nama Pelamar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Skor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tanggal Tes
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {DUMMY_RESULTS.map((result, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.applicantName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">
                  {result.score}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      result.isPassed
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {result.isPassed ? "Lulus" : "Gagal"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.testDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                    Lihat Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      {/* Tombol Toggle Mode */}
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
      </div>

      {/* Konten yang Dipilih */}
      {mode === "results" ? <TestResultsDisplay /> : <TestCreationForm />}
    </div>
  );
};

export default PreSelectionTestPanel;
