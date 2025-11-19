// app/jobs/[jobId]/JobDetailClient.tsx

"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import {
  MapPin,
  Building,
  DollarSign,
  Clock,
  Calendar,
  Briefcase,
  ChevronLeft,
  Send,
  Share2,
  Heart,
  CheckCircle,
  Tag,
} from "lucide-react";
import TakeTestButton from "@/components/job-detail/TakeTestButton";

interface JobProps {
  id: number;
  title: string;
  description: string;
  company: { id: number; name: string; description: string | null };
  logoUrl: string;
  location: string;
  type: string;
  salaryDisplay: string;
  postedDate: string;
  category: { name: string };
  tagsList: string[];
}

export default function JobDetailClient({ job }: { job: JobProps }) {
  // Panggil hook useRouter
  const router = useRouter();
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleApply = () => {
    router.push(`/jobs/${job.id}/apply`);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Link pekerjaan telah disalin ke clipboard!");
    } else {
      alert("Gagal menyalin link.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tombol Kembali */}
        <a
          href="/jobs"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition font-semibold"
        >
          <ChevronLeft size={20} className="mr-1" /> Kembali ke Daftar Pekerjaan
        </a>

        {/* Grid Konten Utama */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Kolom Kiri: Deskripsi Pekerjaan */}
          <div className="lg:w-2/3">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-100">
              {/* Header Pekerjaan */}
              <div className="flex items-start justify-between border-b pb-6 mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      job.logoUrl && job.logoUrl.trim() !== ""
                        ? job.logoUrl
                        : "/img/jobseeker/jobs-page/image-company-default.jpg"
                    }
                    onError={(e) => {
                      e.currentTarget.src =
                        "/img/jobseeker/jobs-page/image-company-default.jpg";
                    }}
                    alt={`${job.company.name} logo`}
                    className="w-16 h-16 object-cover rounded-xl border p-1 flex-shrink-0"
                  />
                  <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">
                      {job.title}
                    </h1>
                    <p className="text-xl text-gray-600 mt-1">
                      <a
                        href={`/companies/${job.company.id}`}
                        className="hover:underline"
                      >
                        {job.company.name}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Aksi Cepat (Save/Share) - Mobile/Tablet */}
                <div className="flex space-x-3 lg:hidden">
                  <button
                    onClick={handleSave}
                    className={`p-3 rounded-full transition ${
                      isSaved
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title={
                      isSaved ? "Hapus dari Tersimpan" : "Simpan Pekerjaan"
                    }
                  >
                    <Heart size={20} fill={isSaved ? "white" : "none"} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                    title="Bagikan"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Tags/Skills Section */}
              <div className="mb-6 flex flex-wrap gap-2">
                {job.tagsList.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                  >
                    <Tag size={14} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Deskripsi Lengkap */}
              <div className="text-gray-700 leading-relaxed">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">
                  Deskripsi Pekerjaan
                </h3>
                <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Detail & Aksi */}
          <div className="lg:w-1/3 space-y-6">
            {/* Box Aksi (Apply Button) */}
            <div className="lg:sticky lg:top-4 bg-white p-6 rounded-xl shadow-2xl border border-gray-100">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Aksi Lamaran
              </h3>

              {isApplied ? (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg flex items-center space-x-3">
                  <CheckCircle size={24} className="text-green-500" />
                  <p className="text-green-700 font-semibold">
                    Lamaran Anda Sudah Terkirim!
                  </p>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleApply}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition transform hover:scale-[1.01] shadow-xl shadow-red-500/30"
                  >
                    <Send size={20} />
                    <span>AJUKAN LAMARAN SEKARANG</span>
                  </button>

                  <div className="mt-6 ml-2">
                    <TakeTestButton jobId={job.id} />
                  </div>
                </>
              )}

              {/* Aksi Cepat (Save/Share) - Desktop */}
              <div className="hidden lg:flex justify-center space-x-4 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={handleSave}
                  className={`flex items-center space-x-2 py-2 px-4 rounded-full transition border ${
                    isSaved
                      ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <Heart size={18} fill={isSaved ? "white" : "none"} />
                  <span>{isSaved ? "Tersimpan" : "Simpan"}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 py-2 px-4 rounded-full bg-white text-gray-600 border border-gray-300 hover:bg-gray-100 transition"
                >
                  <Share2 size={18} />
                  <span>Bagikan</span>
                </button>
              </div>
            </div>

            {/* Box Ringkasan Detail */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Ringkasan Pekerjaan
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <Briefcase size={20} className="text-blue-500" />
                  <span className="font-medium text-gray-700">Kategori:</span>
                  <span className="text-gray-600 ml-auto">
                    {job.category.name}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Clock size={20} className="text-blue-500" />
                  <span className="font-medium text-gray-700">Tipe:</span>
                  <span className="text-gray-600 ml-auto">{job.type}</span>
                </li>
                <li className="flex items-center space-x-3">
                  <MapPin size={20} className="text-blue-500" />
                  <span className="font-medium text-gray-700">Lokasi:</span>
                  <span className="text-gray-600 ml-auto text-right">
                    {job.location}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <DollarSign size={20} className="text-blue-500" />
                  <span className="font-medium text-gray-700">Gaji:</span>
                  <span className="text-gray-600 ml-auto">
                    {job.salaryDisplay}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Calendar size={20} className="text-blue-500" />
                  <span className="font-medium text-gray-700">
                    Dipublikasi:
                  </span>
                  <span className="text-gray-600 ml-auto">
                    {job.postedDate}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
