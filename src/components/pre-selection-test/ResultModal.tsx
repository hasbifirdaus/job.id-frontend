import React from "react";

interface ResultModalProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
  score,
  correctAnswers,
  totalQuestions,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl w-80 text-center">
        <h2 className="text-xl font-bold mb-4">Hasil Tes</h2>
        <p>Skor: {score}%</p>
        <p>
          Jawaban Benar: {correctAnswers} / {totalQuestions}
        </p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
