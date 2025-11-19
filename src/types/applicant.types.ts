// // FILE: src/types/applicant.types.ts

// // Sesuaikan dengan output Prisma di findApplicantsByJob
// interface UserData {
//   id: number;
//   name: string;
//   email: string;
//   dob: Date; // Perlu dihitung usianya di frontend
//   education: string | null;
//   profile_image_url: string | null; // <-- photoUrl di frontend
//   address: string | null;
//   gender: string | null;
// }

// export interface RawApplicationData {
//   id: number; // application ID
//   job_id: number;
//   user_id: number;
//   status: "APPLIED" | "PROCESSED" | "INTERVIEWED" | "ACCEPTED" | "REJECTED"; // Enum dari Prisma
//   expected_salary: number | null; // Asumsi field ini ada di skema applications
//   cv_document_url: string | null; // Asumsi field ini ada di skema applications
//   created_at: Date; // Untuk submissionDate

//   user: UserData;
//   cv_url?: string;
// }

// // Tipe data yang dibutuhkan oleh komponen ApplicantListTable.tsx
// export interface Applicant {
//   id: string; // ID Aplikasi
//   name: string;
//   photoUrl: string;
//   age: number;
//   education: string;
//   expectedSalary: number;
//   status: "Applied" | "Processed" | "Interviewed" | "Accepted" | "Rejected"; // Dikonversi dari status Prisma
//   submissionDate: string;
//   cvUrl: string | null;
// }

// export interface ApplicantQueryParams {
//   page?: number;
//   limit?: number;
//   sortKey?: "created_at" | "expected_salary" | "user_name" | "user_dob"; // Sesuaikan sortKey backend
//   sortOrder?: "asc" | "desc";
//   name?: string;
//   minAge?: number;
//   maxAge?: number;
//   education?: string;
//   // Tambahkan status untuk filter frontend (jika nanti Anda implementasikan di backend)
//   status?: Applicant["status"];
//   // maxSalary: karena backend Anda hanya menerima expected_salary (lte), kita asumsikan ini adalah batas atas
//   maxSalary?: number;
//   expected_salary?: number;
// }

// // **TAMBAHKAN INI:** Tipe data yang digunakan untuk sorting di kolom tabel frontend
// export type SortField = "submissionDate" | "name" | "age" | "expectedSalary";

// export interface ApplicantListResponse {
//   applicants: Applicant[];
//   total: number;
//   page: number;
//   limit: number;
// }
