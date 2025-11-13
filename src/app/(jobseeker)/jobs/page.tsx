"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  X,
} from "lucide-react";

/* ============================================================
  🎨 TIPE DATA (Interface)
============================================================ */
// Mengganti nama 'Job' menjadi 'JobListing' agar lebih spesifik
interface JobListing {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  category: string;
  postedDate: string; // Mengganti 'date' menjadi 'postedDate'
}

/* ============================================================
  💼 DATA & KONSTANTA
============================================================ */
// Data dummy dipindahkan ke luar komponen utama agar tidak dibuat ulang (re-render)
const JOB_DATA: JobListing[] = [
  {
    id: 1,
    title: "Full-Stack Developer",
    company: "TechNova Corp",
    location: "Jakarta, Remote",
    type: "Full-Time",
    salary: "Rp 15-20 Juta",
    category: "Teknologi",
    postedDate: "2 hari lalu",
  },
  {
    id: 2,
    title: "Senior UI/UX Designer",
    company: "Creative Flow",
    location: "Bandung",
    type: "Full-Time",
    salary: "Rp 12-18 Juta",
    category: "Desain",
    postedDate: "5 hari lalu",
  },
  {
    id: 3,
    title: "Marketing Specialist",
    company: "Growth Hub",
    location: "Surabaya",
    type: "Contract",
    salary: "Rp 8-12 Juta",
    category: "Pemasaran",
    postedDate: "1 minggu lalu",
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "Insight Solutions",
    location: "Remote",
    type: "Full-Time",
    salary: "Rp 10-15 Juta",
    category: "Teknologi",
    postedDate: "3 hari lalu",
  },
  {
    id: 5,
    title: "HR Generalist",
    company: "People First",
    location: "Medan",
    type: "Full-Time",
    salary: "Rp 7-10 Juta",
    category: "SDM",
    postedDate: "1 hari lalu",
  },
  {
    id: 6,
    title: "Finance Staff",
    company: "Money Makers",
    location: "Jakarta",
    type: "Part-Time",
    salary: "Rp 5-7 Juta",
    category: "Keuangan",
    postedDate: "2 minggu lalu",
  },
];

const FILTER_OPTIONS = {
  category: ["Teknologi", "Desain", "Pemasaran", "SDM", "Keuangan"],
  type: ["Full-Time", "Part-Time", "Contract", "Internship"],
  salaryRange: ["< Rp 5 Juta", "Rp 5-10 Juta", "Rp 10-15 Juta", "> Rp 15 Juta"],
};

/* ============================================================
  🧱 KOMPONEN: JobCard
============================================================ */
const JobCard: React.FC<{ job: JobListing }> = ({ job }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-blue-500/30 transition border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    {/* Info Utama */}
    <div className="flex items-start gap-4 flex-1">
      {/* Logo Placeholder */}
      <div className="w-14 h-14 object-cover rounded-xl border p-1 flex-shrink-0 flex items-center justify-center bg-gray-100 text-gray-800 font-bold text-xl">
        {job.company.substring(0, 2)}
      </div>

      {/* Detail Job */}
      <div>
        <a
          href={`/jobs/${job.id}`}
          className="text-xl font-bold text-gray-800 hover:text-blue-600 transition block"
        >
          {job.title}
        </a>
        <p className="text-sm text-gray-500">{job.company}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <MapPin size={14} className="text-red-500" /> {job.location}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign size={14} className="text-green-600" /> {job.salary}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-yellow-600" /> {job.type}
          </span>
        </div>
      </div>
    </div>

    {/* Aksi & Kategori */}
    <div className="flex flex-col items-start md:items-end space-y-2">
      <span className="text-xs text-gray-500">Diposting: {job.postedDate}</span>
      <a
        href={`/jobs/${job.id}`}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-[1.02] shadow-md"
      >
        Lihat Detail
      </a>
      <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
        {job.category}
      </span>
    </div>
  </div>
);

/* ============================================================
  🎛️ KOMPONEN: FilterSection
============================================================ */
interface FilterSectionProps {
  title: string;
  options: string[];
  selected: string[];
  onSelect: (option: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  selected,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-lg font-semibold text-gray-700 hover:text-blue-600 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2">
          {options.map((option) => (
            <div key={option} className="flex items-center">
              <input
                id={`filter-${title.replace(/\s/g, "")}-${option.replace(
                  /\s/g,
                  ""
                )}`}
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onSelect(option)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor={`filter-${title.replace(/\s/g, "")}-${option.replace(
                  /\s/g,
                  ""
                )}`}
                className="ml-3 text-sm text-gray-600 cursor-pointer hover:text-gray-800"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ============================================================
  🖥️ HALAMAN: JobListPage (Komponen Utama)
============================================================ */
export default function JobListPage() {
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({
    category: [],
    type: [],
    salaryRange: [],
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  /* ---------- LOGIKA FILTER ---------- 
    Menggunakan useMemo untuk mengoptimalkan performa. 
    Daftar pekerjaan hanya dihitung ulang ketika state filter atau pencarian berubah.
  */
  const appliedJobs = useMemo(() => {
    return JOB_DATA.filter((job) => {
      // Perbaikan: Konversi ke lowercase hanya sekali untuk efisiensi
      const lowerSearchTerm = searchTerm.toLowerCase();
      const lowerSearchLocation = searchLocation.toLowerCase();

      // 1. Filter Pencarian (Judul/Perusahaan)
      const matchesSearch =
        job.title.toLowerCase().includes(lowerSearchTerm) ||
        job.company.toLowerCase().includes(lowerSearchTerm);

      // 2. Filter Lokasi
      const matchesLocation = job.location
        .toLowerCase()
        .includes(lowerSearchLocation);

      // 3. Filter Kategori
      const matchesCategory =
        filters.category.length === 0 ||
        filters.category.includes(job.category);

      // 4. Filter Tipe Kontrak
      const matchesType =
        filters.type.length === 0 || filters.type.includes(job.type);

      /* NOTE: Filter Rentang Gaji (salaryRange) belum diterapkan dalam logika.
        Jika ingin menerapkan, tambahkan logika parsing string salary dan 
        bandingkan dengan rentang yang dipilih. Saat ini diabaikan karena 
        data dummy dan opsi filter gaji tidak mudah dicocokkan.
      */

      return matchesSearch && matchesLocation && matchesCategory && matchesType;
    });
  }, [searchTerm, searchLocation, filters]);

  // Fungsi untuk mengelola perubahan checkbox filter
  const handleFilterChange = (
    filterName: keyof typeof filters,
    option: string
  ) => {
    setFilters((prev) => {
      const current = prev[filterName] || [];
      return current.includes(option)
        ? { ...prev, [filterName]: current.filter((item) => item !== option) }
        : { ...prev, [filterName]: [...current, option] };
    });
  };

  // Fungsi untuk menghapus semua filter
  const handleClearFilters = () => {
    setFilters({ category: [], type: [], salaryRange: [] });
    setSearchTerm("");
    setSearchLocation("");
    setMobileFilterOpen(false); // Tambahkan penutupan filter mobile
  };

  /* ---------- UI (Tampilan) ---------- */
  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Semua Lowongan Pekerjaan
          </h1>
          <p className="text-gray-600 text-lg">
            Ditemukan{" "}
            <span className="font-bold text-blue-600">
              {appliedJobs.length}
            </span>{" "}
            lowongan yang sesuai.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-lg mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Keyword */}
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Judul, Perusahaan, Kata Kunci..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>

            {/* Lokasi */}
            <div className="relative flex-1">
              <MapPin
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Lokasi (mis: Jakarta, Remote)"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>

            {/* Tombol Filter (Mobile) */}
            <button
              className="md:hidden bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
              onClick={() => setMobileFilterOpen(true)}
            >
              <Filter size={20} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* GRID UTAMA */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* === SIDEBAR FILTER === */}
          {/* Perbaikan: Menggunakan transform untuk animasi slide-in/out mobile */}
          <div
            className={`${
              mobileFilterOpen
                ? "fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-sm p-4"
                : "hidden"
            } lg:static lg:block lg:w-1/4 transition-all duration-300`}
          >
            <div
              className={`bg-white rounded-xl shadow-xl p-6 h-full lg:h-auto overflow-y-auto lg:overflow-visible transform transition-transform duration-300 ${
                mobileFilterOpen
                  ? "translate-x-0"
                  : "translate-x-full lg:translate-x-0"
              } w-full max-w-sm ml-auto lg:max-w-none lg:ml-0`}
              // Mengganti translate-y-full menjadi translate-x-full/0 untuk slide dari kanan (opsional)
            >
              {/* Header Mobile */}
              <div className="flex justify-between items-center lg:hidden mb-6 border-b pb-3">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Filter size={24} /> Filter
                </h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-800 transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Tombol Hapus Semua Filter */}
              <button
                onClick={handleClearFilters}
                className="w-full text-red-600 flex items-center justify-center gap-2 py-2 mb-6 border border-red-200 rounded-lg hover:bg-red-50 transition"
              >
                <RefreshCw size={16} /> **Hapus Semua Filter**
              </button>

              {/* Section Filter */}
              <div className="space-y-6">
                <FilterSection
                  title="Bidang Pekerjaan"
                  options={FILTER_OPTIONS.category}
                  selected={filters.category}
                  onSelect={(option) => handleFilterChange("category", option)}
                />

                <FilterSection
                  title="Tipe Kontrak"
                  options={FILTER_OPTIONS.type}
                  selected={filters.type}
                  onSelect={(option) => handleFilterChange("type", option)}
                />

                <FilterSection
                  title="Rentang Gaji"
                  options={FILTER_OPTIONS.salaryRange}
                  selected={filters.salaryRange}
                  onSelect={(option) =>
                    handleFilterChange("salaryRange", option)
                  }
                />
              </div>

              {/* Tombol "Tampilkan Hasil" hanya muncul di mobile */}
              {mobileFilterOpen && (
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full mt-8 py-3 bg-blue-600 text-white rounded-lg font-semibold lg:hidden hover:bg-blue-700 transition"
                >
                  Tampilkan Hasil
                </button>
              )}
            </div>
          </div>

          {/* === DAFTAR PEKERJAAN === */}
          <div className="lg:w-3/4 space-y-6">
            {appliedJobs.length > 0 ? (
              appliedJobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="text-center p-12 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300">
                <p className="text-2xl font-bold text-gray-600">
                  😕 Ups! Tidak ada pekerjaan yang ditemukan.
                </p>
                <p className="text-gray-500 mt-2">
                  Coba ubah kata kunci atau hapus semua filter.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  <RefreshCw size={16} /> Reset Pencarian
                </button>
              </div>
            )}

            {/* Pagination */}
            {appliedJobs.length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <a
                    href="#"
                    className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 transition"
                  >
                    Sebelumnya
                  </a>
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">
                    1
                  </span>
                  <a
                    href="#"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                  >
                    2
                  </a>
                  <a
                    href="#"
                    className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 transition"
                  >
                    Berikutnya
                  </a>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
