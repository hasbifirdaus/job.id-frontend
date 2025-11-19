// Mengacu pada enum ApplicationStatus di Prisma Anda (SUBMITTED, REVIEWED, INTERVIEW, ACCEPTED, REJECTED)
// Kita harus memetakan status frontend (Applied, Processed, dll.) ke status Prisma.

export type FrontendStatus =
  | "Applied"
  | "Processed"
  | "Interviewed"
  | "Accepted"
  | "Rejected";

// Tipe data yang dikembalikan oleh API findApplicantsByJob setelah diolah/dimapping:
export interface Applicant {
  id: string; // ID Aplikasi (seharusnya number, tapi di frontend sering diubah string untuk key)
  name: string; // user.name
  email: string; // user.email
  age: number; // Dihitung di backend (atau di client jika datenya tersedia)
  education: string; // user.education
  photoUrl: string; // user.profile_image_url
  expectedSalary: number;
  submissionDate: string; // created_at
  status: FrontendStatus; // Status Prisma yang sudah di-mapping ke FrontendStatus
  cvUrl: string | null; // cv_url di Aplikasi
}

// Tipe data untuk parameter query
export interface ApplicantQueryParams {
  page: number;
  limit: number;
  sortKey: SortKey;
  sortOrder: "asc" | "desc";
  name: string;
  minAge: number; // Tidak digunakan di backend services, tapi tetap dipertahankan di state frontend
  maxAge: number; // Tidak digunakan di backend services, tapi tetap dipertahankan di state frontend
  education: string;
  maxSalary?: number | 999999999; // Diteruskan sebagai expected_salary (lte) ke backend
  status?: FrontendStatus; // Status filter (saat ini belum diimplementasikan di service backend)
}

// Key yang digunakan untuk sorting di frontend
export type SortField = "submissionDate" | "name" | "age" | "expectedSalary";

// Key yang akan dikirim ke backend
export type SortKey =
  | "created_at"
  | "user_name" // Mapping untuk 'name'
  | "user_dob" // Mapping untuk 'age' (jika ada)
  | "expected_salary";
