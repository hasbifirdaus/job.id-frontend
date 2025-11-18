// FILE: src/services/JobsService.client.ts

import axiosClient from "@/lib/axiosClient"; // Sesuaikan path jika perlu
import { ContractType } from "@/types/job";

// Tipe data respons dari JobsController.listJobs
export interface JobListingResponse {
  id: number;
  title: string;
  category: { id: number; name: string };
  city: { id: number; name: string };
  is_published: boolean;
  deadline: string;
  _count: { applications: number }; // Jumlah pelamar
}

export interface JobListResult {
  total: number;
  page: number;
  perPage: number;
  items: JobListingResponse[];
}

interface ListJobsParams {
  q?: string;
  category_id?: number;
  is_published?: boolean; // New filter
  sortBy?: "created_at" | "title" | "deadline";
  sortDir?: "asc" | "desc";
  page?: number;
  perPage?: number;
}

export interface JobDetailResponse {
  id: number;
  title: string;
  description: string;
  min_salary: number;
  max_salary: number;
  deadline: string;
  is_published: boolean;
  contract_type: ContractType;

  // Relasi yang disertakan (sesuai include di JobsService.getJobById)
  tags: { tag: { name: string } }[];
  category: { id: number; name: string };
  city: { id: number; name: string };
  company: { id: number; name: string };

  // Informasi pelamar
  applications: { user: any /* ... field aplikasi lainnya ... */ }[];
  _count: { applications: number };
}

export const ClientJobsService = {
  /**
   * Mengambil daftar lowongan kerja
   * Endpoint: GET /api/jobs
   */
  async getJobList(params: ListJobsParams): Promise<JobListResult> {
    const queryParams: any = {
      ...params,
      is_published:
        params.is_published !== undefined
          ? String(params.is_published)
          : undefined,
    };

    const response = await axiosClient.get<JobListResult>("/jobPosting", {
      params: queryParams,
    });

    return response.data;
  },

  /**
   * Mengubah status publish (Draft <-> Published)
   * Endpoint: PATCH /api/jobs/:id/publish
   */
  async togglePublishStatus(jobId: number, publish: boolean): Promise<any> {
    const response = await axiosClient.patch(`/jobPosting/${jobId}/publish`, {
      is_published: publish,
    });
    return response.data;
  },

  /**
   * Menghapus lowongan kerja
   * Endpoint: DELETE /api/jobs/:id
   */
  async deleteJob(jobId: number): Promise<any> {
    const response = await axiosClient.delete(`/jobPosting/${jobId}`);
    return response.data;
  },

  async getJobDetailById(jobId: number): Promise<JobDetailResponse> {
    // URL di routes Express.js Anda menggunakan /:id, tetapi base URL client mungkin sudah menyertakan /api.
    // Asumsi: endpoint lengkap adalah /api/jobs/:id (atau /jobPosting/:id jika sesuai dengan baseURL di client)
    const response = await axiosClient.get<{
      data: JobDetailResponse; // Controller Anda merespons { data: job }
    }>(`/jobPosting/${jobId}`);

    return response.data.data;
  },
};
