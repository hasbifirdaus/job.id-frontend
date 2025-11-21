import axiosClient from "@/lib/axiosClient";

import { TestConfig, Question } from "@/types/preSelectionTest.types";

// GET: ambil konfigurasi tes untuk job tertentu
export const fetchTestConfig = async (jobId: number): Promise<TestConfig> => {
  const res = await axiosClient.get(`/preselectiontest/${jobId}/test`);
  return res.data as TestConfig;
};

export const upsertTestConfig = async (
  config: TestConfig
): Promise<TestConfig> => {
  if (config.testId) {
    const res = await axiosClient.put(
      `/preselectiontest/${config.testId}`,
      config
    );
    return res.data as TestConfig; // <-- CAST
  } else {
    const res = await axiosClient.post(
      `/preselectiontest/${config.jobId}`,
      config
    );
    return res.data as TestConfig; // <-- CAST
  }
};

// DELETE: hapus satu pertanyaan
export const deleteQuestion = async (questionId: number): Promise<void> => {
  await axiosClient.delete(`/preselectiontest/question/${questionId}`);
};
