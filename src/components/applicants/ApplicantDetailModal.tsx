"use client";

import { useState, useEffect } from "react";
import axiosClient from "@/lib/axiosClient";
import toast from "react-hot-toast";

interface IUser {
  id: number;
  name: string;
  email: string;
  dob?: string;
  education?: string;
  address?: string;
  gender?: string;
  profile_image_url?: string;
}

interface IJob {
  id: number;
  title: string;
  company: { name: string; logo_image_url?: string };
}

interface IApplicationDetail {
  id: number;
  status: "INTERVIEW" | "ACCEPTED" | "REJECTED";
  expected_salary?: number;
  created_at: string;
  user: IUser;
  job: IJob;
  cv_url?: string;
}

interface ApplicationDetailResponse {
  application: IApplicationDetail;
}

interface Props {
  applicationId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: () => void;
}

export default function ApplicantDetailModal({
  applicationId,
  isOpen,
  onClose,
  onStatusUpdated,
}: Props) {
  const [application, setApplication] = useState<IApplicationDetail | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [newStatus, setNewStatus] = useState<
    "" | "INTERVIEW" | "ACCEPTED" | "REJECTED"
  >("");

  useEffect(() => {
    if (!applicationId || !isOpen) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get<ApplicationDetailResponse>(
          `/company/applications/${applicationId}`
        );
        setApplication(res.data.application);
      } catch (err: any) {
        toast.error(
          err.response?.data?.error || "Gagal mengambil detail pelamar"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [applicationId, isOpen]);

  const handleStatusChange = async () => {
    if (!newStatus || !applicationId) return;
    setStatusLoading(true);
    try {
      await axiosClient.patch(`/company/applications/${applicationId}/status`, {
        status: newStatus,
      });
      toast.success("Status berhasil diperbarui");
      onStatusUpdated();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Gagal update status");
    } finally {
      setStatusLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "text-green-600 font-semibold";
      case "INTERVIEW":
        return "text-yellow-600 font-semibold";
      case "REJECTED":
        return "text-red-600 font-semibold";
      default:
        return "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
        >
          ✕
        </button>

        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : application ? (
          <>
            {/* Header */}
            <div className="flex items-center mb-4 gap-4">
              <img
                src={
                  application.job.company.logo_image_url || "/default-logo.png"
                }
                alt={application.job.company.name}
                className="w-12 h-12 object-contain rounded"
              />
              <div>
                <h2 className="text-xl font-bold">{application.user.name}</h2>
                <p className="text-sm text-gray-600">
                  {application.user.email}
                </p>
                <p className="text-sm text-gray-600">
                  {application.user.education}
                </p>
              </div>
            </div>

            {/* Job Info */}
            <div className="mb-4">
              <p>
                <strong>Posisi:</strong> {application.job.title}
              </p>
              <p>
                <strong>Perusahaan:</strong> {application.job.company.name}
              </p>
              <p>
                <strong>Tanggal Aplikasi:</strong>{" "}
                {new Date(application.created_at).toLocaleDateString("id-ID")}
              </p>
            </div>

            {/* Personal Info */}
            <div className="mb-4">
              <p>
                <strong>Alamat:</strong> {application.user.address || "-"}
              </p>
              <p>
                <strong>Jenis Kelamin:</strong> {application.user.gender || "-"}
              </p>
              <p>
                <strong>Ekspektasi Gaji:</strong>{" "}
                {application.expected_salary
                  ? application.expected_salary.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })
                  : "-"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={getStatusColor(application.status)}>
                  {application.status}
                </span>
              </p>
            </div>

            {/* CV Preview */}
            {application.cv_url && (
              <div className="my-4">
                <h3 className="font-semibold mb-2">Preview CV</h3>
                <iframe
                  src={application.cv_url}
                  className="w-full h-64 border rounded"
                  title="CV Preview"
                ></iframe>
              </div>
            )}

            {/* Update Status */}
            <div className="flex gap-2 mt-4">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="border p-2 rounded flex-1"
              >
                <option value="">Pilih Status</option>
                <option value="INTERVIEW">Interview</option>
                <option value="ACCEPTED">Diterima</option>
                <option value="REJECTED">Ditolak</option>
              </select>
              <button
                onClick={handleStatusChange}
                disabled={statusLoading || !newStatus}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
              >
                {statusLoading ? "Memproses..." : "Update Status"}
              </button>
            </div>
          </>
        ) : (
          <p className="text-center py-10">Data pelamar tidak ditemukan</p>
        )}
      </div>
    </div>
  );
}
