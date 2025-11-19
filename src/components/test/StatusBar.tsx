"use client";

import React from "react";
import { CheckCircle, AlertTriangle, PowerOff } from "lucide-react";
import { TestStatus } from "@/types/preSelectionTest.types";

interface StatusBarProps {
  status: TestStatus;
  onDisable: () => void;
  isSaving: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({
  status,
  onDisable,
  isSaving,
}) => (
  <div
    className={`p-3 rounded-lg border flex justify-between items-center ${
      status === "published"
        ? "bg-green-50 border-green-300 text-green-700"
        : "bg-yellow-50 border-yellow-300 text-yellow-700"
    }`}
  >
    <div className="flex items-center">
      {status === "published" ? (
        <CheckCircle className="w-5 h-5 mr-2" />
      ) : (
        <AlertTriangle className="w-5 h-5 mr-2" />
      )}
      <span className="font-medium">
        Status Tes:{" "}
        <span className="font-bold">
          {status === "published" ? "AKTIF" : "NONAKTIF"}
        </span>
      </span>
    </div>
    {status === "published" && (
      <button
        onClick={onDisable}
        disabled={isSaving}
        className="flex items-center text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
      >
        <PowerOff className="w-4 h-4 mr-1" /> Matikan Tes
      </button>
    )}
  </div>
);

export default StatusBar;
