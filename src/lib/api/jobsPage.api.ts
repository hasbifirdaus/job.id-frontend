import axiosClient from "@/lib/axiosClient";
import { JobDetailFromAPI } from "@/types/jobsPage.types";

/**
 * Mengambil detail pekerjaan berdasarkan ID.
 * @param jobId ID pekerjaan
 * @returns Detail pekerjaan
 */
export const getJobDetail = async (
  jobId: string
): Promise<JobDetailFromAPI> => {
  // Catatan: Pastikan jobId adalah string, karena URL params dari Next.js adalah string.
  try {
    const response = await axiosClient.get<JobDetailFromAPI>(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    // Biarkan error dilempar agar ditangani di komponen
    console.error("API Error in getJobDetail:", error);
    throw new Error("Gagal mengambil detail pekerjaan.");
  }
};
