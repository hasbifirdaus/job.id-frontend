import {
  Applicant,
  ApplicantQueryParams,
  FrontendStatus,
} from "@/types/applicants.types";
// Base API URL
const API_URL = "http://localhost:8000/api/applicantmanagement";
// ================================
// Mapping Helpers
// ================================
const mapPrismaStatusToFrontend = (prismaStatus: string): FrontendStatus => {
  switch (prismaStatus) {
    case "SUBMITTED":
      return "Applied";
    case "REVIEWED":
      return "Processed";
    case "INTERVIEW":
      return "Interviewed";
    case "ACCEPTED":
      return "Accepted";
    case "REJECTED":
      return "Rejected";
    default:
      return "Applied";
  }
};
// Mapping Frontend -> Backend (full caps)
const mapFrontendToBackendStatus = (status: FrontendStatus): string => {
  switch (status) {
    case "Applied":
      return "APPLIED";
    case "Processed":
      return "PROCESSED";
    case "Interviewed":
      return "INTERVIEWED";
    case "Accepted":
      return "ACCEPTED";
    case "Rejected":
      return "REJECTED";
    default:
      return "APPLIED";
  }
};
// ================================
// Helper Hitung Usia
// ================================
const calculateAge = (dob: string | Date | null | undefined): number => {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
// ================================
// Backend Response Types
// ================================
interface BackendApplicant {
  id: number;
  expected_salary: number;
  status: string;
  created_at: string;
  cv_url: string | null;
  user: {
    id: number;
    name: string;
    email: string;
    dob: Date | string | null;
    education: string;
    profile_image_url: string;
  };
}
interface BackendResponse {
  applicants: BackendApplicant[];
  total: number;
}
// ================================
// MAIN SERVICE
// ================================
export const ApplicantService = {
  // GET APPLICANTS
  getApplicantsByJobId: async (
    jobId: number,
    params: ApplicantQueryParams
  ): Promise<{ applicants: Applicant[]; total: number }> => {
    const token = localStorage.getItem("token");
    const queryParams: Record<string, any> = {
      page: params.page,
      limit: params.limit,
      sortKey: params.sortKey,
      sortOrder: params.sortOrder,
    };
    if (params.name) queryParams.name = params.name;
    if (params.education) queryParams.education = params.education;
    if (params.maxSalary !== undefined)
      queryParams.expected_salary = params.maxSalary;
    const url = new URL(`${API_URL}/company/jobs/${jobId}/applicants`);
    Object.keys(queryParams).forEach((key) =>
      url.searchParams.append(key, queryParams[key])
    );
    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || errorData?.message || "Failed to fetch applicants"
      );
    }
    const data: BackendResponse = await response.json();
    const applicants: Applicant[] = data.applicants.map((app) => ({
      id: app.id.toString(),
      name: app.user.name,
      email: app.user.email,
      age: calculateAge(app.user.dob),
      education: app.user.education,
      photoUrl: app.user.profile_image_url || "/default-photo.png",
      expectedSalary: app.expected_salary,
      submissionDate: app.created_at,
      status: mapPrismaStatusToFrontend(app.status),
      cvUrl: app.cv_url,
    }));
    return {
      applicants,
      total: data.total,
    };
  },
  // UPDATE STATUS
  updateApplicationStatus: async (
    applicantId: number,
    newStatus: FrontendStatus,
    notes: string = "Status updated from admin panel"
  ): Promise<Applicant> => {
    const token = localStorage.getItem("token");
    const backendStatus = mapFrontendToBackendStatus(newStatus);
    const response = await fetch(
      `${API_URL}/company/applications/${applicantId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ status: backendStatus, notes }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || errorData?.message || "Failed to update status"
      );
    }
    const data = await response.json();
    const updated = data.application as BackendApplicant;
    return {
      id: updated.id.toString(),
      name: updated.user.name,
      email: updated.user.email,
      age: calculateAge(updated.user.dob),
      education: updated.user.education,
      photoUrl: updated.user.profile_image_url || "/default-photo.png",
      expectedSalary: updated.expected_salary,
      submissionDate: updated.created_at,
      status: mapPrismaStatusToFrontend(updated.status),
      cvUrl: updated.cv_url,
    };
  },
  // GET SIGNED CV URL
  getSignedCvUrl: async (applicantId: number): Promise<string> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_URL}/company/applications/${applicantId}/signed-cv-url`,
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.error || "Gagal mendapatkan link CV.");
    }
    const data = await response.json();
    return data.signedUrl;
  },
};
