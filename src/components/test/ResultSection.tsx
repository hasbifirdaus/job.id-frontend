"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Loader2, FileText } from "lucide-react";
import axiosClient from "@/lib/axiosClient";

interface Result {
  applicationId: number;
  applicantName: string;
  applicantEmail: string;
  score: number;
  isPassed: boolean;
  testDate?: string;
  applicationStatus: string;
}

interface ResultsSectionProps {
  jobId: string;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ jobId }) => {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get<Result[]>(
        `/preselectiontest/${jobId}/test/results`
      );
      setResults(res.data || []);
    } catch (e: any) {
      console.error(e);
      setError(e.response?.data?.message || "Gagal memuat data hasil tes.");
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 mr-3 animate-spin text-indigo-600" />
        <p className="text-lg text-gray-600">Memuat hasil tes...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <h4 className="font-bold mb-1">Terjadi Kesalahan!</h4>
        <p>{error}</p>
        <button
          onClick={fetchResults}
          className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Coba Muat Ulang
        </button>
      </div>
    );

  if (results.length === 0)
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center space-y-3">
        <FileText className="w-12 h-12 text-gray-400" />
        <p className="text-gray-500 text-lg font-medium">
          Belum ada data hasil tes untuk job ini.
        </p>
        <p className="text-gray-400 text-sm">
          Hasil akan muncul di sini setelah peserta menyelesaikan tes.
        </p>
      </div>
    );

  return (
    <div className="space-y-4">
      {results.map((r) => (
        <div
          key={r.applicationId}
          className="p-4 border rounded-lg flex justify-between items-center bg-white"
        >
          <div>
            <p className="font-medium text-gray-800">{r.applicantName}</p>
            <p className="text-sm text-gray-500">{r.applicantEmail}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-700">
              {r.score.toFixed(2)} / 100
            </p>
            <p
              className={`text-sm ${
                r.isPassed ? "text-green-600" : "text-red-600"
              }`}
            >
              {r.isPassed ? "Lulus" : "Tidak Lulus"}
            </p>
            <p className="text-xs text-gray-400">{r.testDate}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsSection;
