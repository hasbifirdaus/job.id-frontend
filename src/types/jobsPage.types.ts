// src/types/job.ts

// Enum / Literal Types dari Prisma
type ContractType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "TEMPORARY"
  | "INTERNSHIP";

// Tipe Dasar (Menggantikan Jobs dari Prisma)
export interface JobsBase {
  id: number;
  company_id: number;
  category_id: number;
  city_id: number;
  title: string;
  description: string;
  min_salary: number | null;
  max_salary: number | null;
  contract_type: ContractType;
  is_published: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  // Jika ada kolom lain di Jobs, tambahkan di sini.
}

// Tipe Detail Pekerjaan yang Sesuai dengan Output getJobByIdService
export interface JobDetailFromAPI extends JobsBase {
  company: {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    description: string | null;
    logo_image_url: string | null;
    location: string | null;
  };
  category: {
    id: number;
    name: string;
  };
  city: {
    id: number;
    name: string;
    province: {
      id: number;
      name: string;
    };
  };
  tags: Array<{
    id: number;
    tag: {
      id: number;
      name: string;
    };
  }>;
}
