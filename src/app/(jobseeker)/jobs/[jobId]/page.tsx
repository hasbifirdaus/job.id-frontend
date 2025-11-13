"use client";
import React, { useState } from "react";
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
} from "lucide-react";

// Tipe Data untuk Detail Pekerjaan
interface JobDetail {
  id: number;
  title: string;
  company: string;
  logoUrl: string;
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  category: string;
  description: string;
  benefits: string[];
}

// Data Pekerjaan Dummy (Diambil berdasarkan jobId)
const dummyJobDetail: JobDetail = {
  id: 1,
  title: "Full-Stack Developer (Remote)",
  company: "TechNova Corp",
  logoUrl: "https://placehold.co/80x80/dddddd/333333?text=TN",
  location: "Jakarta & 100% Remote",
  type: "Full-Time",
  salary: "Rp 15.000.000 - Rp 20.000.000 / bulan",
  postedDate: "2 hari lalu",
  category: "Teknologi",
  description: `
        Kami mencari Full-Stack Developer berpengalaman untuk bergabung dengan tim kami. Anda akan bertanggung jawab untuk mendesain, mengembangkan, dan memelihara aplikasi web skala besar.
        
        <h3 class="text-xl font-bold mt-6 mb-3 text-gray-800">Tanggung Jawab Utama:</h3>
        <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Merancang dan mengimplementasikan fitur front-end menggunakan React/Next.js.</li>
            <li>Membangun dan mengelola API backend (Node.js/Express).</li>
            <li>Mengelola database (PostgreSQL/MongoDB) dan memastikan kinerja yang optimal.</li>
            <li>Bekerja sama dengan tim desain dan produk untuk memahami kebutuhan pengguna.</li>
            <li>Memastikan kualitas kode melalui pengujian unit dan integrasi.</li>
        </ul>

        <h3 class="text-xl font-bold mt-6 mb-3 text-gray-800">Kualifikasi:</h3>
        <ul class="list-disc list-inside space-y-2 ml-4">
            <li>Minimal 3 tahun pengalaman sebagai Full-Stack atau Backend Developer.</li>
            <li>Mahir dalam JavaScript/TypeScript, React, dan Node.js.</li>
            <li>Pengalaman dengan layanan cloud (AWS/GCP/Azure) adalah nilai tambah.</li>
            <li>Mampu bekerja secara mandiri dan dalam tim yang terdistribusi (remote).</li>
        </ul>
    `,
  benefits: [
    "Asuransi Kesehatan (Keluarga)",
    "Cuti Tahunan 14 hari",
    "Tunjangan Internet & Remote",
    "Bonus Kinerja Tahunan",
    "Peluang Pelatihan dan Sertifikasi",
  ],
};

// Interface untuk parameter dinamis dari Next.js App Router
interface JobDetailPageProps {
  params: {
    jobId: string; // ID lowongan pekerjaan dari URL
  };
}

// ==== Halaman Utama Job Detail (sesuai app/jobs/[jobId]/page.tsx) ====
export default function JobDetailPage({ params }: JobDetailPageProps) {
  const job = dummyJobDetail; // Di masa depan, data akan diambil berdasarkan params.jobId
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Fungsi placeholder untuk simulasi
  const handleApply = () => {
    // Ganti dengan notifikasi kustom, bukan alert
    alert(`Simulasi: Lamaran untuk Job ID ${params.jobId} dikirim!`);
    setIsApplied(true);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    // Simulasikan menyalin link ke clipboard
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
                    src={job.logoUrl}
                    alt={`${job.company} logo`}
                    className="w-16 h-16 object-cover rounded-xl border p-1 flex-shrink-0"
                  />
                  <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">
                      {job.title}
                    </h1>
                    <p className="text-xl text-gray-600 mt-1">{job.company}</p>
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

              {/* Deskripsi Lengkap */}
              <div
                className="prose max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />

              {/* Benefit Perusahaan */}
              <div className="mt-10 pt-6 border-t border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Keuntungan & Benefit
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {job.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg"
                    >
                      <CheckCircle
                        size={20}
                        className="text-blue-600 flex-shrink-0"
                      />
                      <span className="text-gray-700 text-sm font-medium">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Detail & Aksi */}
          <div className="lg:w-1/3 space-y-6">
            {/* Box Aksi (Apply Button) */}
            <div className="sticky top-4 bg-white p-6 rounded-xl shadow-2xl border border-gray-100">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Aplikasi Cepat
              </h3>

              {isApplied ? (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg flex items-center space-x-3">
                  <CheckCircle size={24} className="text-green-500" />
                  <p className="text-green-700 font-semibold">
                    Lamaran Anda Sudah Terkirim!
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 hover:bg-red-700 transition transform hover:scale-[1.01] shadow-xl shadow-red-500/30"
                >
                  <Send size={20} />
                  <span>AJUKAN LAMARAN SEKARANG</span>
                </button>
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
                  <span className="text-gray-600 ml-auto">{job.category}</span>
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
                    {job.salary.split("/")[0].trim()}
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Calendar size={20} className="text-blue-500" />
                  <span className="font-medium text-gray-700">Diposting:</span>
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
