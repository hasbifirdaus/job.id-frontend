"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";

interface TakeTestButtonProps {
  jobId: number;
}

const TakeTestButton: React.FC<TakeTestButtonProps> = ({ jobId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [testAvailable, setTestAvailable] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkTest = async () => {
      try {
        // Cek apakah ada tes untuk job ini
        await axiosClient.get(`/preselectiontest/${jobId}/test/applicant`);
        setTestAvailable(true);
      } catch (err: any) {
        setTestAvailable(false);
        setError(err.response?.data?.message || "");
      } finally {
        setIsLoading(false);
      }
    };
    checkTest();
  }, [jobId]);

  if (isLoading)
    return (
      <button className="bg-gray-300 px-4 py-2 rounded-lg">Loading...</button>
    );

  if (!testAvailable)
    return (
      <p className="text-gray-500">
        Pre-Selection Test tidak tersedia untuk pekerjaan ini.
      </p>
    );

  return (
    <button
      onClick={() => router.push(`/jobs/${jobId}/preselection`)}
      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
    >
      Take Test
    </button>
  );
};

export default TakeTestButton;
