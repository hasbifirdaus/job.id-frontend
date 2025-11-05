"use client";
import React from "react";

interface IAuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function AuthInput({ label, error, ...props }: IAuthInputProps) {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-300"
            : "border-gray-300 focus:ring-blue-300"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error} </p>}
    </div>
  );
}
