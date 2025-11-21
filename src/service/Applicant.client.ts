// import axiosClient from "@/lib/axiosClient";
// import {
//   ApplicantQueryParams,
//   ApplicantListResponse,
//   RawApplicationData,
//   Applicant,
// } from "../types/applicant.types";

// const calculateAge = (dob: Date | string): number => {
//   const today = new Date();
//   const birthDate = new Date(dob);
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDifference = today.getMonth() - birthDate.getMonth();

//   if (
//     monthDifference < 0 ||
//     (monthDifference === 0 && today.getDate() < birthDate.getDate())
//   ) {
//     age--;
//   }
//   return age;
// };

// const mapToFrontendApplicant = (rawApp: RawApplicationData): Applicant => {
//   const statusMap: {
//     [key in RawApplicationData["status"]]: Applicant["status"];
//   } = {
//     APPLIED: "Applied",
//     PROCESSED: "Processed",
//     INTERVIEWED: "Interviewed",
//     ACCEPTED: "Accepted",
//     REJECTED: "Rejected",
//   };

//   const user = rawApp.user;

//   const age = user?.dob ? calculateAge(user.dob) : 0;

//   let finalCvUrl = rawApp.cv_url || "";
//   if (finalCvUrl) {
//     const previewTransformation = "fl_attachment:false/";

//     if (!finalCvUrl.includes(previewTransformation)) {
//       finalCvUrl = finalCvUrl.replace(
//         "/upload/",
//         `/upload/${previewTransformation}`
//       );
//     }

//     if (!finalCvUrl.toLowerCase().endsWith(".pdf")) {
//       const urlParts = finalCvUrl.split(/[?#]/);
//       finalCvUrl =
//         urlParts[0] + ".pdf" + (urlParts.length > 1 ? urlParts[1] : "");
//     }
//   }

//   return {
//     id: String(rawApp.id),
//     name: user?.name || "Pelamar Tidak Dikenal",
//     photoUrl:
//       user?.profile_image_url || "https://i.pravatar.cc/150?img=default",
//     age,
//     education: user?.education || "N/A",
//     expectedSalary: rawApp.expected_salary || 0,

//     status: statusMap[
//       rawApp.status as keyof typeof statusMap
//     ] as Applicant["status"],
//     submissionDate: new Date(rawApp.created_at).toISOString(),
//     cvUrl: finalCvUrl,
//   };
// };

// const safeNumber = (val: any) => {
//   const num = Number(val);
//   return val !== null &&
//     val !== undefined &&
//     val !== "" &&
//     !isNaN(num) &&
//     isFinite(num)
//     ? num
//     : undefined;
// };

// export const ApplicantService = {
//   getSignedCvUrl: async (applicationId: number): Promise<string> => {
//     const response = await axiosClient.get<{ signedUrl: string }>(
//       `applicantmanagement/company/applications/${applicationId}/signed-cv-url`
//     );

//     return response.data.signedUrl;
//   },

//   async getApplicantsByJobId(
//     jobId: number,
//     params: ApplicantQueryParams
//   ): Promise<ApplicantListResponse> {
//     const queryParams = {
//       page: safeNumber(params.page) ?? 1,
//       limit: safeNumber(params.limit) ?? 10,
//       sortKey: params.sortKey ?? "created_at",
//       sortOrder: params.sortOrder ?? "asc",
//       name: params.name?.trim() || undefined,
//       education: params.education?.trim() || undefined,
//       minAge: safeNumber(params.minAge),
//       maxAge: safeNumber(params.maxAge),
//       expected_salary:
//         safeNumber(params.expected_salary) === 0
//           ? undefined
//           : safeNumber(params.expected_salary),
//     };

//     console.log("[DEBUG] Final query params:", queryParams);

//     const response = await axiosClient.get<{
//       applicants: RawApplicationData[];
//       total: number;
//       page: number;
//       limit: number;
//     }>(`/applicantmanagement/company/jobs/${jobId}/applicants`, {
//       params: queryParams,
//     });

//     const applicants = response.data.applicants.map(mapToFrontendApplicant);

//     return {
//       applicants,
//       total: response.data.total,
//       page: response.data.page,
//       limit: response.data.limit,
//     };
//   },

//   async updateApplicationStatus(
//     applicationId: number,
//     newStatus: Applicant["status"]
//   ): Promise<Applicant> {
//     const prismaStatus = newStatus.toUpperCase();

//     const response = await axiosClient.patch<{
//       application: RawApplicationData;
//     }>(`/applicantmanagement/company/applications/${applicationId}/status`, {
//       status: prismaStatus,
//     });

//     const updatedRawApp = response.data.application;
//     return mapToFrontendApplicant(updatedRawApp);
//   },
// };
