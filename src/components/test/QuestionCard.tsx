"use client";

import React, { useState, useEffect, memo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Question } from "@/types/preSelectionTest.types";

interface QuestionCardProps {
  q: Question;
  index: number;
  totalCount: number;
  onDelete: (id: number) => void;
  onAdd: () => void;
  onCommit: (updated: Question) => void;
  onImmediateCommit?: (updated: Question) => void;
}

const QuestionCard = memo(function QuestionCard({
  q,
  index,
  totalCount,
  onDelete,
  onAdd,
  onCommit,
  onImmediateCommit,
}: QuestionCardProps) {
  const [localQ, setLocalQ] = useState<Question>(q);

  useEffect(() => setLocalQ(q), [q]);

  const handleOptionChange = (idx: number, value: string) => {
    setLocalQ((prev) => {
      const newOptions: [string, string, string, string] = [
        prev.options[0],
        prev.options[1],
        prev.options[2],
        prev.options[3],
      ];
      newOptions[idx] = value;
      return { ...prev, options: newOptions };
    });
  };

  const handleCorrectAnswerChange = (idx: 0 | 1 | 2 | 3) => {
    const updated: Question = { ...localQ, correctAnswer: idx };
    setLocalQ(updated);
    onImmediateCommit?.(updated);
    onCommit(updated);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md space-y-4">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <label className="text-lg font-bold">Pertanyaan #{index + 1}</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete(q.id)}
            className={`p-1 rounded-full ${
              totalCount > 1
                ? "text-red-500 hover:bg-red-100"
                : "text-gray-400 cursor-not-allowed"
            }`}
            disabled={totalCount === 1}
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={onAdd}
            className={`p-1 rounded-full ${
              totalCount >= 25
                ? "text-gray-400 cursor-not-allowed"
                : "text-indigo-600 hover:bg-indigo-100"
            }`}
            disabled={totalCount >= 25}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <textarea
        placeholder="Masukkan teks pertanyaan..."
        rows={2}
        className="w-full border rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
        value={localQ.question}
        onChange={(e) => setLocalQ((p) => ({ ...p, question: e.target.value }))}
        onBlur={() => onCommit(localQ)}
      />

      <div className="space-y-2">
        <p className="text-sm font-semibold">Opsi Jawaban:</p>
        {localQ.options.map((option, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <input
              type="radio"
              name={`correct-answer-${q.id}`}
              checked={localQ.correctAnswer === idx}
              onChange={() => handleCorrectAnswerChange(idx as 0 | 1 | 2 | 3)}
              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="w-6 text-center">
              {String.fromCharCode(65 + idx)}:
            </span>
            <input
              type="text"
              placeholder={`Opsi ${String.fromCharCode(65 + idx)}`}
              className="flex-1 border rounded-lg p-2 text-sm"
              value={option}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              onBlur={() => onCommit(localQ)}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

QuestionCard.displayName = "QuestionCard";
export default QuestionCard;
