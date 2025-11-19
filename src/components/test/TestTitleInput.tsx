"use client";

import React from "react";

interface TestTitleInputProps {
  title: string;
  setTitle: (t: string) => void;
}

const TestTitleInput: React.FC<TestTitleInputProps> = ({ title, setTitle }) => (
  <div className="space-y-2">
    <label className="block ml-2 font-medium text-gray-700">Judul Tes</label>
    <input
      type="text"
      placeholder="Contoh: Tes Kemampuan Dasar Coding"
      className="w-full border rounded-lg p-2.5 text-base font-semibold focus:ring-indigo-500 focus:border-indigo-500"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
  </div>
);

export default TestTitleInput;
