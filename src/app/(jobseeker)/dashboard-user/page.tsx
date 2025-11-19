"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Search,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Calendar,
  MapPin,
  MessageSquare,
  Loader2, // New icon for loading
} from "lucide-react";

import useApplications from "@/hooks/useApplyList";
import { ApplicationItem as Application } from "@/lib/api/applyList";

// Utility: Fungsi untuk format mata uang Rupiah
const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

// Utility: Mendapatkan detail status untuk ikon dan warna
const getStatusDetails = (status: Application["status"]) => {
  // Pastikan "Accepted" dan "REJECTED" sesuai dengan kasus backend
  switch (status) {
    case "INTERVIEW":
      return { icon: Clock, color: "text-yellow-600 bg-yellow-100" };
    case "REVIEWED":
      return { icon: Send, color: "text-blue-600 bg-blue-100" };
    case "ACCEPTED": // Menggunakan ACCEPTED (sesuai backend)
      return { icon: TrendingUp, color: "text-green-600 bg-green-100" };
    case "REJECTED":
      return { icon: XCircle, color: "text-red-600 bg-red-100" };
    case "SUBMITTED":
    default:
      return { icon: Briefcase, color: "text-gray-600 bg-gray-100" };
  }
};

// --- Komponen Modal Detail Status ---
const ApplicationDetailModal: React.FC<{
  application: Application;
  onClose: () => void;
}> = ({ application, onClose }) => {
  const interview = application.interviewDetails;
  const rejected = application.rejectedDetails;

  // Persiapan data dengan parse tanggal dari string
  const applicationDate = new Date(application.applicationDate);
  const interviewDate = interview ? new Date(interview.date) : null;

  // Sort history (latest first) dan parse date
  const historyWithParsedDate = application.statusHistory
    .map((h) => ({ ...h, date: new Date(h.date) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all">
        {/* Header Modal */}
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-900">Detail Lamaran</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <XCircle size={24} />
          </button>
        </div>

        {/* Konten Detail */}
        <div className="p-6 space-y-6">
          {/* Ringkasan Pekerjaan */}
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
            <h3 className="text-lg font-bold text-blue-800">
              {application.jobTitle}
            </h3>
            <p className="text-sm text-blue-600">
              di {application.companyName}
            </p>
            <p className="text-sm mt-2 flex items-center gap-2 font-medium">
              <DollarSign size={16} /> Ekspektasi Gaji:{" "}
              {formatRupiah(application.salaryExpectation)}
            </p>
          </div>

          {/* === Blok Detail Wawancara === */}
          {application.status === "INTERVIEW" && interview && interviewDate && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-300 shadow-sm space-y-2">
              <h4 className="text-lg font-bold text-yellow-800 flex items-center gap-2">
                <Calendar size={20} /> Jadwal Wawancara
              </h4>
              <p className="text-sm text-gray-700 ml-6">
                <span className="font-semibold">Tanggal & Waktu:</span>{" "}
                {interviewDate.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                pukul {interview.time}
              </p>
              <p className="text-sm text-gray-700 ml-6">
                <span className="font-semibold">Lokasi/Platform:</span>{" "}
                {interview.location}
                {interview.link && (
                  <a
                    href={interview.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-2 text-xs"
                  >
                    {" "}
                    (Link Meeting)
                  </a>
                )}
              </p>
              <p className="text-sm text-gray-700 ml-6">
                <span className="font-semibold">Pewawancara:</span>{" "}
                {interview.interviewer}
              </p>
            </div>
          )}

          {/* === Blok Detail Penolakan === */}
          {application.status === "REJECTED" && rejected && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-300 shadow-sm space-y-2">
              <h4 className="text-lg font-bold text-red-800 flex items-center gap-2">
                <XCircle size={20} /> Lamaran Ditolak
              </h4>
              <div className="ml-6 space-y-2">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Alasan Utama:</span>{" "}
                  {rejected.reason}
                </p>
                <div className="p-3 bg-red-100 rounded-md">
                  <p className="text-xs font-semibold text-red-700 flex items-center gap-1">
                    <MessageSquare size={14} /> Review Perusahaan:
                  </p>
                  <p className="text-sm text-red-800 mt-1">
                    {rejected.reviewNote}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Riwayat Status (Timeline) */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Riwayat Proses
            </h3>
            <ol className="relative border-l border-gray-200 ml-4">
              {historyWithParsedDate.map((history, index) => {
                const details = getStatusDetails(
                  history.status as Application["status"]
                );
                return (
                  <li key={index} className="mb-8 ml-6">
                    <span
                      className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white ${details.color}`}
                    >
                      {React.createElement(details.icon, { size: 18 })}
                    </span>
                    <h4 className="flex items-center mb-1 text-base font-semibold text-gray-900">
                      {history.status}
                    </h4>
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                      {history.date.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                    <p className="text-base font-normal text-gray-600">
                      {history.note}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Komponen Kartu Lamaran ---
const ApplicationCard: React.FC<{
  application: Application;
  onClick: () => void;
}> = ({ application, onClick }) => {
  const details = getStatusDetails(application.status);
  const applicationDate = new Date(application.applicationDate); // Parse date string

  return (
    <div
      className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:border-blue-300 transition duration-300 cursor-pointer flex justify-between items-center"
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-bold text-gray-900 truncate">
          {application.jobTitle}
        </h3>
        <p className="text-md text-gray-600 font-medium mt-1">
          {application.companyName}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Dikirim pada: {applicationDate.toLocaleDateString("id-ID")}
        </p>
      </div>

      <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
        <div
          className={`px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 ${details.color}`}
        >
          {React.createElement(details.icon, { size: 18 })}
          <span>{application.status}</span>
        </div>
        <div className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition">
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  );
};

// --- Halaman Utama Dashboard ---
export default function UserDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  // Asumsi pagination sederhana, hanya ambil 1 halaman besar untuk demo
  const PAGE_LIMIT = 50;
  const PAGE_NUMBER = 1;

  // Ganti MOCK_APPLICATIONS dengan hook API
  const {
    applications: rawApplications,
    loading,
    error,
    total,
    refresh,
  } = useApplications(PAGE_NUMBER, PAGE_LIMIT, filterStatus, searchTerm);

  // Menggunakan data langsung dari rawApplications (sudah difilter search di hook)
  const filteredApplications = rawApplications;

  // Hitungan Status untuk ringkasan (dihitung dari data yang sudah di-fetch dari API)
  const statusCounts = useMemo(() => {
    return rawApplications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<Application["status"], number>);
  }, [rawApplications]);

  // Daftar status unik yang ada
  const uniqueStatuses = Object.keys(statusCounts) as Application["status"][];
  const ALL_POSSIBLE_STATUSES: Application["status"][] = [
    "SUBMITTED",
    "REVIEWED",
    "INTERVIEW",
    "ACCEPTED",
    "REJECTED",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <Briefcase size={32} className="mr-3 text-blue-600" />
          Lamaran Saya
        </h1>

        {/* Ringkasan Status Lamaran */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {ALL_POSSIBLE_STATUSES.map((status) => {
            const count = statusCounts[status] || 0;
            const details = getStatusDetails(status);
            return (
              <div
                key={status}
                className={`p-4 rounded-xl shadow-md border-l-4 ${details.color.replace(
                  "text",
                  "border"
                )} bg-white`}
              >
                <div className={`flex items-center space-x-2 ${details.color}`}>
                  {React.createElement(details.icon, { size: 24 })}
                  <span className="text-lg font-bold">{count}</span>
                </div>
                <p className="text-sm font-medium text-gray-600 mt-1">
                  {status}
                </p>
              </div>
            );
          })}
        </div>

        {/* Filter dan Pencarian */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pencarian */}
          <div className="relative md:col-span-2">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari lowongan atau perusahaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter Status */}
          <div className="relative">
            <CheckCircle
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">Semua Status</option>
              {ALL_POSSIBLE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <ChevronRight
              size={18}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Daftar Lamaran */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Daftar Lamaran ({filteredApplications.length})
        </h2>

        {loading && (
          <div className="text-center p-10 bg-white rounded-xl shadow-md text-blue-600">
            <Loader2 size={40} className="mx-auto mb-4 animate-spin" />
            <p>Memuat data lamaran...</p>
          </div>
        )}

        {error && (
          <div className="text-center p-10 bg-white rounded-xl shadow-md text-red-600">
            <XCircle size={40} className="mx-auto mb-4" />
            <p>Gagal memuat data: {error}</p>
            <button
              onClick={refresh}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onClick={() => setSelectedApplication(app)}
                />
              ))
            ) : (
              <div className="text-center p-10 bg-white rounded-xl shadow-md text-gray-500">
                <Briefcase size={40} className="mx-auto mb-4" />
                <p>
                  Tidak ada lamaran yang cocok dengan kriteria pencarian Anda.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Modal Detail Status Lamaran */}
        {selectedApplication && (
          <ApplicationDetailModal
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
          />
        )}
      </div>
    </div>
  );
}
