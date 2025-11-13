"use client";
import React, { useState } from "react";
import {
  MapPin,
  Users,
  Briefcase,
  Globe,
  Info,
  Clock,
  CheckCircle,
  Building2,
} from "lucide-react";

// Data Mock untuk Perusahaan dan Pekerjaan
const mockCompany = {
  id: 1,
  name: "Tech Solutions",
  industry: "Teknologi Informasi",
  location: "Jakarta, Indonesia",
  size: "101-500 Karyawan",
  website: "www.techsolutions.com",
  established: 2010,
  description:
    "Tech Solutions adalah perusahaan inovatif yang berfokus pada pengembangan solusi perangkat lunak enterprise dan layanan konsultasi IT. Kami percaya pada budaya kerja yang kolaboratif dan progresif, memberikan kesempatan bagi para talenta terbaik untuk tumbuh bersama. Visi kami adalah menjadi perusahaan teknologi terdepan di Asia Tenggara.",
  logo: "https://placehold.co/150x150/F4F7FE/4A90E2?text=TS",
};

const mockJobs = [
  {
    id: 101,
    title: "Backend Engineer (GoLang)",
    location: "Jakarta",
    postedDate: new Date(2025, 10, 10),
    salary: "Rp 18-25 Juta",
  },
  {
    id: 102,
    title: "Product Manager",
    location: "Remote",
    postedDate: new Date(2025, 10, 5),
    salary: "Rp 20-30 Juta",
  },
  {
    id: 103,
    title: "DevOps Specialist",
    location: "Jakarta",
    postedDate: new Date(2025, 9, 28),
    salary: "Rp 15-22 Juta",
  },
];

// --- Komponen Kartu Lowongan Sederhana (untuk Tab Lowongan) ---
const JobListingCard: React.FC<(typeof mockJobs)[0]> = ({
  id,
  title,
  location,
  postedDate,
  salary,
}) => {
  const daysAgo = Math.ceil(
    Math.abs(new Date().getTime() - postedDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <a
      href={`/jobs/${id}`}
      className="block bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition border border-gray-200"
    >
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        <span className="text-sm font-bold text-green-600">{salary}</span>
      </div>
      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
        <div className="flex items-center gap-1">
          <MapPin size={14} />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>Diposting {daysAgo} hari lalu</span>
        </div>
      </div>
    </a>
  );
};

// --- Halaman Detail Perusahaan Utama ---
export default function CompanyDetailPage({
  params,
}: {
  params: { companyId: string };
}) {
  // Simulasi pengambilan data berdasarkan companyId
  const company = mockCompany;
  const availableJobs = mockJobs;

  const [activeTab, setActiveTab] = useState<"profile" | "jobs">("profile");

  // --- Tab Profil Perusahaan ---
  const ProfileTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <Info size={24} className="mr-2 text-blue-600" /> Tentang Perusahaan
      </h3>

      {/* Deskripsi (RTE Content - Simulasi) */}
      <div className="prose max-w-none text-gray-700 leading-relaxed">
        <p>{company.description}</p>
        <p className="font-semibold mt-4">
          Tim kami selalu mencari talenta yang bersemangat untuk bergabung
          dengan perjalanan kami!{" "}
        </p>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Informasi Tambahan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <div className="flex items-center space-x-2">
            <Building2 size={20} className="text-blue-500 flex-shrink-0" />
            <p>
              <span className="font-semibold">Industri:</span>{" "}
              {company.industry}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin size={20} className="text-blue-500 flex-shrink-0" />
            <p>
              <span className="font-semibold">Lokasi Pusat:</span>{" "}
              {company.location}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Users size={20} className="text-blue-500 flex-shrink-0" />
            <p>
              <span className="font-semibold">Ukuran:</span> {company.size}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={20} className="text-blue-500 flex-shrink-0" />
            <p>
              <span className="font-semibold">Didirikan:</span>{" "}
              {company.established}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Tab Lowongan Pekerjaan Perusahaan ---
  const JobsTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {availableJobs.length} Lowongan Tersedia di {company.name}
      </h3>

      {availableJobs.length > 0 ? (
        <div className="space-y-4">
          {availableJobs.map((job) => (
            <JobListingCard key={job.id} {...job} />
          ))}
        </div>
      ) : (
        <div className="text-center p-10 bg-gray-100 rounded-xl text-gray-500">
          <Briefcase size={40} className="mx-auto mb-4" />
          <p>
            Saat ini belum ada lowongan pekerjaan aktif dari perusahaan ini.
          </p>
        </div>
      )}
    </div>
  );

  // --- Struktur Utama Halaman ---
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Perusahaan */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl mb-8 border-t-4 border-blue-600">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img
              src={company.logo}
              alt={`${company.name} Logo`}
              className="w-24 h-24 rounded-xl object-cover border p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/150x150/CCCCCC/000000?text=Logo";
              }}
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {company.name}
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                {company.industry}
              </p>
              <a
                href={`http://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition flex items-center text-sm mt-1"
              >
                <Globe size={16} className="mr-1" /> {company.website}
              </a>
            </div>
          </div>
        </div>

        {/* Navigasi Tab */}
        <div className="bg-white rounded-xl shadow-md mb-6 p-1 flex space-x-1 border border-gray-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center ${
              activeTab === "profile"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Info size={20} className="mr-2" /> Profil
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition flex items-center justify-center ${
              activeTab === "jobs"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Briefcase size={20} className="mr-2" /> Lowongan (
            {availableJobs.length})
          </button>
        </div>

        {/* Konten Tab */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "jobs" && <JobsTab />}
        </div>
      </div>
    </div>
  );
}
