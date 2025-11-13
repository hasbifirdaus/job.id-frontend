"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Building2,
  ChevronRight,
  Users,
  SortAsc,
} from "lucide-react";

// Data Dummy untuk Perusahaan
const ALL_COMPANIES = [
  {
    id: 1,
    name: "Tech Solutions",
    industry: "Teknologi Informasi",
    location: "Jakarta",
    size: "101-500 Karyawan",
    jobCount: 15,
    logo: "https://placehold.co/100x100/F4F7FE/4A90E2?text=TS",
  },
  {
    id: 2,
    name: "Brandify Agency",
    industry: "Pemasaran & Periklanan",
    location: "Bandung",
    size: "51-100 Karyawan",
    jobCount: 5,
    logo: "https://placehold.co/100x100/FFF8F4/E56B6F?text=BA",
  },
  {
    id: 3,
    name: "Innovatech",
    industry: "Pengembangan Perangkat Lunak",
    location: "Remote",
    size: "1000+ Karyawan",
    jobCount: 22,
    logo: "https://placehold.co/100x100/EAFBF8/4CC9F0?text=IT",
  },
  {
    id: 4,
    name: "Alpha Capital",
    industry: "Layanan Keuangan",
    location: "Surabaya",
    size: "501-1000 Karyawan",
    jobCount: 8,
    logo: "https://placehold.co/100x100/F0F0FF/845EC2?text=AC",
  },
  {
    id: 5,
    name: "PT Global Mandiri",
    industry: "Manufaktur",
    location: "Jakarta",
    size: "5000+ Karyawan",
    jobCount: 30,
    logo: "https://placehold.co/100x100/FCFFFC/2D8C3D?text=GM",
  },
];

const companyLocations = ["Jakarta", "Bandung", "Surabaya", "Remote"];

// --- Komponen Kartu Perusahaan ---
const CompanyCard: React.FC<(typeof ALL_COMPANIES)[0]> = ({
  id,
  name,
  industry,
  location,
  size,
  jobCount,
  logo,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between">
    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
      <img
        src={logo}
        alt={`${name} Logo`}
        className="w-16 h-16 rounded-xl object-cover border p-1"
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null;
          (e.target as HTMLImageElement).src =
            "https://placehold.co/100x100/CCCCCC/000000?text=Logo";
        }}
      />
      <div>
        <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition">
          <a href={`/companies/${id}`}>{name}</a>
        </h3>
        <p className="text-sm text-gray-600 font-medium">{industry}</p>
        <div className="flex flex-wrap items-center gap-x-3 text-xs text-gray-500 mt-1">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{size}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="flex items-center space-x-4 ml-auto sm:ml-0">
      <div className="text-center bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-lg text-sm">
        {jobCount} Lowongan
      </div>
      <a
        href={`/companies/${id}`}
        className="p-2 border border-gray-300 rounded-full text-gray-500 hover:bg-blue-600 hover:text-white transition"
      >
        <ChevronRight size={20} />
      </a>
    </div>
  </div>
);

// --- Halaman Utama Daftar Perusahaan ---
export default function AllCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState<"name_asc" | "job_count_desc">(
    "name_asc"
  );

  // Logika Pemfilteran dan Pengurutan
  const filteredAndSortedCompanies = useMemo(() => {
    let companies = ALL_COMPANIES;

    // 1. Filtering
    companies = companies.filter((company) => {
      const matchesName = company.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesLocation =
        selectedLocation === "" || company.location === selectedLocation;
      return matchesName && matchesLocation;
    });

    // 2. Sorting
    companies.sort((a, b) => {
      if (sortBy === "name_asc") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "job_count_desc") {
        return b.jobCount - a.jobCount;
      }
      return 0;
    });

    return companies;
  }, [searchTerm, selectedLocation, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Jelajahi Semua Perusahaan
        </h1>
        <p className="text-gray-600 mb-8">
          Temukan perusahaan impian Anda dari berbagai industri yang terdaftar.
        </p>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filter Berdasarkan Nama */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari nama perusahaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter Berdasarkan Lokasi */}
          <div className="relative">
            <MapPin
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">Semua Lokasi</option>
              {companyLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <ChevronRight
              size={18}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-500 pointer-events-none"
            />
          </div>

          {/* Pengurutan */}
          <div className="relative">
            <SortAsc
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "name_asc" | "job_count_desc")
              }
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="name_asc">Urutkan: Nama A-Z</option>
              <option value="job_count_desc">
                Urutkan: Lowongan Terbanyak
              </option>
            </select>
            <ChevronRight
              size={18}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Company List */}
        <div className="text-lg font-semibold text-gray-700 mb-4">
          Ditemukan {filteredAndSortedCompanies.length} Perusahaan
        </div>

        <div className="space-y-6">
          {filteredAndSortedCompanies.length > 0 ? (
            filteredAndSortedCompanies.map((company) => (
              <CompanyCard key={company.id} {...company} />
            ))
          ) : (
            <div className="text-center p-10 bg-white rounded-xl shadow-md text-gray-500">
              <Building2 size={40} className="mx-auto mb-4" />
              <p>
                Maaf, tidak ada perusahaan yang cocok dengan kriteria pencarian
                Anda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
