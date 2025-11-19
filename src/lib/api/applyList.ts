// src/api/application.api.ts

import axiosClient from "../axiosClient";

// Definisikan tipe untuk Query Params
interface GetApplicationsQuery {
  page?: number;
  limit?: number;
  status?: string | null;
}

// Definisikan tipe untuk Response Item
export interface ApplicationItem {
  id: number;
  jobTitle: string;
  companyName: string;
  applicationDate: string;
  status: "SUBMITTED" | "REVIEWED" | "INTERVIEW" | "ACCEPTED" | "REJECTED";
  salaryExpectation: number;
  jobId: number;
  statusHistory: {
    date: string;
    status: string;
    note: string;
  }[];
  interviewDetails?: {
    date: string;
    time: string;
    location: string;
    interviewer: string;
    link?: string;
  };
  rejectedDetails?: {
    reason: string;
    reviewNote: string;
  };
}

// Tipe keseluruhan Response
export interface ApplicationsResponse {
  total: number;
  page: number;
  limit: number;
  items: ApplicationItem[];
}

// Type guard sederhana untuk axios error
function isAxiosError(
  error: any
): error is { response?: { data: any }; message: string } {
  return error && typeof error === "object" && "message" in error;
}

/**
 * Mendapatkan daftar lamaran milik pengguna.
 */
export const fetchUserApplications = async (
  query: GetApplicationsQuery
): Promise<ApplicationsResponse> => {
  try {
    const { data } = await axiosClient.get<ApplicationsResponse>("/applyList", {
      params: query,
    });
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Error fetching user applications:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unknown error fetching user applications:", error);
    }
    throw new Error("Gagal mengambil daftar lamaran.");
  }
};

/**
 * Mendapatkan detail lamaran.
 */
export const fetchApplicationDetail = async (
  id: number
): Promise<ApplicationItem> => {
  try {
    const { data } = await axiosClient.get<ApplicationItem>(`/applyList/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        `Error fetching application ${id}:`,
        error.response?.data || error.message
      );
    } else {
      console.error(`Unknown error fetching application ${id}:`, error);
    }
    throw new Error("Gagal mengambil detail lamaran.");
  }
};

/**
 * Batalkan lamaran (Withdraw).
 */
export const withdrawApplication = async (
  id: number
): Promise<{ success: boolean }> => {
  try {
    const { data } = await axiosClient.delete<{ success: boolean }>(
      `/applyList/${id}`
    );
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        `Error withdrawing application ${id}:`,
        error.response?.data || error.message
      );
    } else {
      console.error(`Unknown error withdrawing application ${id}:`, error);
    }
    throw new Error("Gagal membatalkan lamaran.");
  }
};
