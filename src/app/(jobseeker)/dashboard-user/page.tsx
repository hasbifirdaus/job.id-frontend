"use client";
import React, { useState, useMemo } from "react";
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
} from "lucide-react";

// Data Mock Lamaran
const MOCK_APPLICATIONS = [
  {
    id: 1,
    jobTitle: "Full-Stack Developer",
    companyName: "Tech Solutions",
    applicationDate: new Date(2025, 10, 15),
    status: "Interview",
    salaryExpectation: 20000000,
    jobId: 101,
    statusHistory: [
      {
        date: new Date(2025, 10, 15),
        status: "Submitted",
        note: "Lamaran berhasil dikirim.",
      },
      {
        date: new Date(2025, 10, 18),
        status: "Reviewed",
        note: "CV Anda sedang ditinjau oleh tim HR.",
      },
      {
        date: new Date(2025, 10, 20),
        status: "Interview",
        note: "Anda diundang untuk Wawancara HR di tanggal 25 Nov 2025.",
      },
    ],
  },
  {
    id: 2,
    jobTitle: "UI/UX Designer",
    companyName: "Creative Hub",
    applicationDate: new Date(2025, 10, 10),
    status: "Rejected",
    salaryExpectation: 15000000,
    jobId: 102,
    statusHistory: [
      {
        date: new Date(2025, 10, 10),
        status: "Submitted",
        note: "Lamaran berhasil dikirim.",
      },
      {
        date: new Date(2025, 10, 12),
        status: "Reviewed",
        note: "CV sedang ditinjau.",
      },
      {
        date: new Date(2025, 10, 22),
        status: "Rejected",
        note: "Terima kasih atas waktu Anda, namun kami tidak dapat melanjutkan proses ini.",
      },
    ],
  },
  {
    id: 3,
    jobTitle: "Data Scientist Intern",
    companyName: "Alpha Labs",
    applicationDate: new Date(2025, 10, 1),
    status: "Reviewed",
    salaryExpectation: 5000000,
    jobId: 103,
    statusHistory: [
      {
        date: new Date(2025, 10, 1),
        status: "Submitted",
        note: "Lamaran berhasil dikirim.",
      },
      {
        date: new Date(2025, 10, 5),
        status: "Reviewed",
        note: "Sedang dalam proses penyaringan awal.",
      },
    ],
  },
  {
    id: 4,
    jobTitle: "Marketing Specialist",
    companyName: "Brandify Agency",
    applicationDate: new Date(2025, 9, 25),
    status: "Offer",
    salaryExpectation: 12000000,
    jobId: 104,
    statusHistory: [
      {
        date: new Date(2025, 9, 25),
        status: "Submitted",
        note: "Lamaran berhasil dikirim.",
      },
      { date: new Date(2025, 9, 27), status: "Reviewed", note: "CV ditinjau." },
      {
        date: new Date(2025, 10, 1),
        status: "Interview",
        note: "Wawancara pertama selesai.",
      },
      {
        date: new Date(2025, 10, 5),
        status: "Offer",
        note: "Selamat! Kami ingin menawarkan posisi ini kepada Anda. Harap balas email kami.",
      },
    ],
  },
];

// Utility: Fungsi untuk format mata uang Rupiah
const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

// Utility: Mendapatkan detail status untuk ikon dan warna
const getStatusDetails = (status: string) => {
  switch (status) {
    case "Interview":
      return { icon: Clock, color: "text-yellow-600 bg-yellow-100" };
    case "Reviewed":
      return { icon: Send, color: "text-blue-600 bg-blue-100" };
    case "Offer":
      return { icon: TrendingUp, color: "text-green-600 bg-green-100" };
    case "Rejected":
      return { icon: XCircle, color: "text-red-600 bg-red-100" };
    case "Submitted":
    default:
      return { icon: Briefcase, color: "text-gray-600 bg-gray-100" };
  }
};

// --- Komponen Modal Detail Status ---
const ApplicationDetailModal: React.FC<{
  application: (typeof MOCK_APPLICATIONS)[0];
  onClose: () => void;
}> = ({ application, onClose }) => {
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

          {/* Status Terkini */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Status Terkini
            </p>
            <div
              className={`p-3 rounded-lg flex items-center space-x-3 ${
                getStatusDetails(application.status).color
              }`}
            >
              {React.createElement(getStatusDetails(application.status).icon, {
                size: 24,
              })}
              <span className="text-lg font-bold">{application.status}</span>
            </div>
          </div>

          {/* Riwayat Status (Timeline) */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Riwayat Proses
            </h3>
            <ol className="relative border-l border-gray-200 ml-4">
              {application.statusHistory
                .slice()
                .reverse()
                .map((history, index) => {
                  const details = getStatusDetails(history.status);
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
  application: (typeof MOCK_APPLICATIONS)[0];
  onClick: () => void;
}> = ({ application, onClick }) => {
  const details = getStatusDetails(application.status);

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
          Dikirim pada:{" "}
          {application.applicationDate.toLocaleDateString("id-ID")}
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
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<
    (typeof MOCK_APPLICATIONS)[0] | null
  >(null);

  // Hitungan Status untuk ringkasan
  const statusCounts = useMemo(() => {
    return MOCK_APPLICATIONS.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  // Daftar status unik yang ada
  const uniqueStatuses = Object.keys(statusCounts);

  // Logika Pemfilteran
  const filteredApplications = useMemo(() => {
    return MOCK_APPLICATIONS.filter((app) => {
      const matchesSearch =
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.companyName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "" || app.status === filterStatus;
      return matchesSearch && matchesStatus;
    }).sort(
      (a, b) => b.applicationDate.getTime() - a.applicationDate.getTime()
    ); // Urutkan terbaru dulu
  }, [searchTerm, filterStatus]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <Briefcase size={32} className="mr-3 text-blue-600" />
          Lamaran Saya
        </h1>

        {/* Ringkasan Status Lamaran */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {uniqueStatuses.map((status) => {
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
              {uniqueStatuses.map((status) => (
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
