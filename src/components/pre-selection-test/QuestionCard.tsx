import React from "react";
import { QuestionOption } from "@/types/preSelection.types";

interface QuestionCardProps {
  question: {
    question_id: number;
    question: string;
    options: Record<QuestionOption, string>;
  };
  selectedAnswer: QuestionOption | null;
  onSelectAnswer: (option: QuestionOption) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-4">
      <h3 className="font-semibold mb-3">{question.question}</h3>
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(question.options).map(([key, value]) => (
          <button
            key={key}
            onClick={() => onSelectAnswer(key as QuestionOption)}
            className={`py-2 px-4 border rounded-lg text-left w-full ${
              selectedAnswer === key ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            <span className="font-bold mr-2">{key}.</span>
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
