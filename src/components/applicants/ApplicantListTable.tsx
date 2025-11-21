// FILE: src/components/ApplicantListTable.tsx
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Filter,
  Eye,
  Check,
  X,
  ArrowRight,
  Video,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { ApplicantService } from "@/service/Applicants.client";

import {
  Applicant,
  ApplicantQueryParams,
  SortField,
  SortKey,
  FrontendStatus,
} from "@/types/applicants.types";

// ================================
// HELPERS
// ================================
const formatToRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusColor = (status: FrontendStatus) => {
  switch (status) {
    case "Applied":
      return "bg-blue-100 text-blue-800";
    case "Processed":
      return "bg-yellow-100 text-yellow-800";
    case "Interviewed":
      return "bg-purple-100 text-purple-800";
    case "Accepted":
      return "bg-green-100 text-green-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// ================================
// COMPONENT
// ================================
interface ApplicantListTableProps {
  jobId: string;
}

const ApplicantListTable: React.FC<ApplicantListTableProps> = ({ jobId }) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [queryParams, setQueryParams] = useState<ApplicantQueryParams>({
    page: 1,
    limit: 10,
    sortKey: "created_at",
    sortOrder: "desc",
    name: "",
    minAge: 0,
    maxAge: 100,
    education: "",
    maxSalary: 999999999,
    status: undefined,
  });

  // ================================
  // FETCH APPLICANTS
  // ================================
  const fetchApplicants = useCallback(async () => {
    if (!jobId) return;
    setIsLoading(true);
    try {
      const jobIdNum = Number(jobId);
      if (isNaN(jobIdNum)) throw new Error("Invalid Job ID");

      const maxSalaryToSend =
        queryParams.maxSalary === 999999999 ? undefined : queryParams.maxSalary;

      const paramsToSend: ApplicantQueryParams = {
        ...queryParams,
        maxSalary: maxSalaryToSend,
      };

      const result = await ApplicantService.getApplicantsByJobId(
        jobIdNum,
        paramsToSend
      );

      // Filter usia di frontend
      const filteredApplicants = result.applicants.filter(
        (app) =>
          app.age >= (queryParams.minAge || 0) &&
          app.age <= (queryParams.maxAge || 100)
      );

      setApplicants(filteredApplicants);
      setTotalApplicants(result.total);
    } catch (error) {
      console.error(error);
      alert("Gagal memuat data pelamar.");
    } finally {
      setIsLoading(false);
    }
  }, [jobId, queryParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplicants();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchApplicants]);

  // ================================
  // HANDLE PREVIEW CV
  // ================================
  const handlePreviewCv = useCallback(async (applicantId: string) => {
    try {
      const signedUrl = await ApplicantService.getSignedCvUrl(
        Number(applicantId)
      );
      setPreviewUrl(signedUrl);
    } catch (error) {
      console.error(error);
      alert("Gagal mendapatkan link CV.");
    }
  }, []);

  // ================================
  // HANDLE STATUS CHANGE
  // ================================
  const handleStatusChange = async (
    applicantId: string,
    newStatus: FrontendStatus
  ) => {
    if (!confirm(`Yakin ingin mengubah status menjadi ${newStatus}?`)) return;

    try {
      const updatedApp = await ApplicantService.updateApplicationStatus(
        Number(applicantId),
        newStatus
      );

      setApplicants((prev) =>
        prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
      );
      alert(`Status pelamar ${updatedApp.name} diubah menjadi ${newStatus}.`);
    } catch (error) {
      console.error(error);
      alert("Gagal mengubah status.");
    }
  };

  // ================================
  // SORTING
  // ================================
  const handleSort = (field: SortField) => {
    const sortKeyMap: Record<SortField, SortKey> = {
      submissionDate: "created_at",
      name: "user_name",
      age: "user_dob",
      expectedSalary: "expected_salary",
    };
    const key = sortKeyMap[field];

    let direction: "asc" | "desc" = "asc";
    if (queryParams.sortKey === key && queryParams.sortOrder === "asc")
      direction = "desc";

    setQueryParams({
      ...queryParams,
      sortKey: key,
      sortOrder: direction,
      page: 1,
    });
  };

  const renderSortIcon = (field: SortField) => {
    const sortKeyMap: Record<SortField, SortKey> = {
      submissionDate: "created_at",
      name: "user_name",
      age: "user_dob",
      expectedSalary: "expected_salary",
    };
    const key = sortKeyMap[field];
    if (queryParams.sortKey !== key) return null;
    return (
      <ChevronDown
        className={`w-3 h-3 ml-1 transition-transform ${
          queryParams.sortOrder === "asc" ? "rotate-180" : "rotate-0"
        }`}
      />
    );
  };

  const displayMaxSalary = queryParams.maxSalary ?? 999999999;

  // ================================
  // PAGINATION HANDLER
  // ================================
  const totalPages = Math.ceil(totalApplicants / queryParams.limit);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  // ================================
  // JSX
  // ================================
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Total Pelamar: {totalApplicants}
      </h2>

      {/* FILTER */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 border rounded-lg">
        <Filter className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Nama..."
          className="border rounded-lg p-2 text-sm max-w-xs"
          value={queryParams.name}
          onChange={(e) =>
            setQueryParams({ ...queryParams, name: e.target.value, page: 1 })
          }
        />
        <select
          className="border rounded-lg p-2 text-sm"
          value={queryParams.status || ""}
          onChange={(e) =>
            setQueryParams({
              ...queryParams,
              status: e.target.value as FrontendStatus | undefined,
              page: 1,
            })
          }
        >
          <option value="">Status</option>
          <option value="Applied">Applied</option>
          <option value="Processed">Processed</option>
          <option value="Interviewed">Interviewed</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          type="text"
          placeholder="Pendidikan..."
          className="border rounded-lg p-2 text-sm max-w-xs"
          value={queryParams.education}
          onChange={(e) =>
            setQueryParams({
              ...queryParams,
              education: e.target.value,
              page: 1,
            })
          }
        />
        <div className="flex items-center space-x-2 text-sm">
          <label className="text-gray-600">Usia:</label>
          <input
            type="number"
            placeholder="Min"
            min="0"
            className="border rounded-lg p-2 w-16 text-sm"
            value={queryParams.minAge || ""}
            onChange={(e) =>
              setQueryParams({
                ...queryParams,
                minAge: Number(e.target.value) || 0,
                page: 1,
              })
            }
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            min="0"
            className="border rounded-lg p-2 w-16 text-sm"
            value={displayMaxSalary === 999999999 ? "" : queryParams.maxAge}
            onChange={(e) =>
              setQueryParams({
                ...queryParams,
                maxAge: Number(e.target.value) || 100,
                page: 1,
              })
            }
          />
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <label className="text-gray-600">Gaji Max (Jt):</label>
          <input
            type="number"
            placeholder="Max"
            min="0"
            step="1"
            className="border rounded-lg p-2 w-20 text-sm"
            value={
              displayMaxSalary === 999999999 ? "" : displayMaxSalary / 1000000
            }
            onChange={(e) =>
              setQueryParams({
                ...queryParams,
                maxSalary: Number(e.target.value) * 1000000 || 999999999,
                page: 1,
              })
            }
          />
        </div>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <div className="text-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mx-auto" />
          <p className="text-gray-500 mt-2">Memuat data pelamar...</p>
        </div>
      ) : applicants.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Belum ada pelamar sesuai filter
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Pelamar (Usia/Pend.) {renderSortIcon("name")}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hover:bg-gray-100"
                  onClick={() => handleSort("expectedSalary")}
                >
                  <div className="flex items-center">
                    Gaji Ekspektasi {renderSortIcon("expectedSalary")}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hover:bg-gray-100"
                  onClick={() => handleSort("submissionDate")}
                >
                  <div className="flex items-center">
                    Tgl Submit {renderSortIcon("submissionDate")}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Dokumen
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-indigo-50/50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={applicant.photoUrl}
                        alt={applicant.name}
                        className="w-8 h-8 rounded-full object-cover mr-3 border"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://i.pravatar.cc/150?img=default")
                        }
                      />
                      <div className="text-sm font-medium text-gray-900">
                        {applicant.name}{" "}
                        <span className="text-xs font-normal text-gray-500">
                          ({applicant.age} thn)
                        </span>
                        <div className="text-xs text-gray-500 font-normal">
                          {applicant.education}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                    {formatToRupiah(applicant.expectedSalary)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(applicant.submissionDate).toLocaleDateString(
                      "id-ID",
                      { dateStyle: "medium" }
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        applicant.status
                      )}`}
                    >
                      {applicant.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => {
                        if (applicant.cvUrl) handlePreviewCv(applicant.id);
                        else alert("CV dokumen tidak tersedia.");
                      }}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center justify-center mx-auto text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" /> Preview CV
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex space-x-1 justify-center">
                      <button
                        title="Proses (Ganti Status)"
                        onClick={() =>
                          handleStatusChange(applicant.id, "Processed")
                        }
                        className="p-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                        disabled={[
                          "Accepted",
                          "Rejected",
                          "Processed",
                          "Interviewed",
                        ].includes(applicant.status)}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                      <button
                        title="Panggil Interview"
                        onClick={() =>
                          handleStatusChange(applicant.id, "Interviewed")
                        }
                        className="p-1 text-purple-600 hover:text-purple-800 disabled:text-gray-400"
                        disabled={[
                          "Accepted",
                          "Rejected",
                          "Interviewed",
                          "Applied",
                        ].includes(applicant.status)}
                      >
                        <Video className="w-5 h-5" />
                      </button>
                      <button
                        title="Terima"
                        onClick={() =>
                          handleStatusChange(applicant.id, "Accepted")
                        }
                        className="p-1 text-green-600 hover:text-green-800 disabled:text-gray-400"
                        disabled={["Accepted", "Rejected", "Applied"].includes(
                          applicant.status
                        )}
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        title="Tolak"
                        onClick={() =>
                          handleStatusChange(applicant.id, "Rejected")
                        }
                        className="p-1 text-red-600 hover:text-red-800 disabled:text-gray-400"
                        disabled={["Rejected", "Accepted"].includes(
                          applicant.status
                        )}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL PREVIEW CV */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-4/5 h-4/5 p-4 rounded-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 z-50 p-2 bg-white rounded-full"
              onClick={() => setPreviewUrl(null)}
              title="Tutup Pratinjau"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe src={previewUrl} className="w-full h-full border-none" />
          </div>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400"
            onClick={() => handlePageChange(queryParams.page - 1)}
            disabled={queryParams.page <= 1}
          >
            Prev
          </button>
          <span>
            {queryParams.page} / {totalPages}
          </span>
          <button
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:text-gray-400"
            onClick={() => handlePageChange(queryParams.page + 1)}
            disabled={queryParams.page >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicantListTable;
