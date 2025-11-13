"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ListFilter, SortAsc, Eye, User, FileText } from "lucide-react";

// Data dummy yang mewakili semua kandidat di sistem
interface Candidate {
  id: string;
  name: string;
  jobApplied: string;
  age: number;
  education: string;
  expectedSalary: number;
  overallStatus: "New Application" | "Screened" | "Interviewed" | "Hired";
  lastActivity: string;
}

const DUMMY_CANDIDATES: Candidate[] = [
  {
    id: "c001",
    name: "Budi Santoso",
    jobApplied: "Senior Frontend Dev",
    age: 28,
    education: "S1 Teknik",
    expectedSalary: 18000000,
    overallStatus: "Interviewed",
    lastActivity: "2 hari lalu",
  },
  {
    id: "c002",
    name: "Sarah Lestari",
    jobApplied: "Marketing Specialist",
    age: 24,
    education: "S1 Desain",
    expectedSalary: 12000000,
    overallStatus: "New Application",
    lastActivity: "1 jam lalu",
  },
  {
    id: "c003",
    name: "Rizky Alamsyah",
    jobApplied: "Financial Analyst",
    age: 32,
    education: "S2 Informatika",
    expectedSalary: 25000000,
    overallStatus: "Screened",
    lastActivity: "1 minggu lalu",
  },
  {
    id: "c004",
    name: "Fitriani Jaya",
    jobApplied: "HR Manager",
    age: 29,
    education: "S1 Hukum",
    expectedSalary: 15000000,
    overallStatus: "Hired",
    lastActivity: "1 bulan lalu",
  },
];

const getStatusColor = (status: Candidate["overallStatus"]) => {
  switch (status) {
    case "New Application":
      return "bg-blue-100 text-blue-800";
    case "Screened":
      return "bg-yellow-100 text-yellow-800";
    case "Interviewed":
      return "bg-purple-100 text-purple-800";
    case "Hired":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const CandidatesPage: React.FC = () => {
  // State untuk filtering dan sorting
  const [filter, setFilter] = useState({ job: "", education: "", status: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // Data dummy untuk opsi filter
  const jobOptions = [
    "Senior Frontend Dev",
    "Marketing Specialist",
    "Financial Analyst",
    "HR Manager",
  ];
  const educationOptions = [
    "S1 Teknik",
    "S1 Desain",
    "S2 Informatika",
    "S1 Hukum",
  ];
  const statusOptions = ["New Application", "Screened", "Interviewed", "Hired"];

  // Komponen Filter Bar Khusus Kandidat
  const CandidateFilterBar = () => (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan Nama Pelamar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Dropdown Filter */}
      <div className="flex items-center space-x-4">
        <ListFilter className="w-5 h-5 text-gray-500" />
        <select className="border rounded-lg p-2 text-sm">
          <option value="">Semua Lowongan</option>
          {jobOptions.map((job) => (
            <option key={job} value={job}>
              {job}
            </option>
          ))}
        </select>
        <select className="border rounded-lg p-2 text-sm">
          <option value="">Semua Pendidikan</option>
          {educationOptions.map((edu) => (
            <option key={edu} value={edu}>
              {edu}
            </option>
          ))}
        </select>
        <select className="border rounded-lg p-2 text-sm">
          <option value="">Semua Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown Sorting */}
      <div className="flex items-center space-x-2">
        <SortAsc className="w-5 h-5 text-gray-500" />
        <select className="border rounded-lg p-2 text-sm">
          <option value="recent">Aktivitas Terbaru</option>
          <option value="age">Usia Termuda</option>
          <option value="salary">Gaji Terendah</option>
        </select>
      </div>
    </div>
  );
  // End CandidateFilterBar

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Daftar Seluruh Kandidat
      </h1>

      {/* Filter Bar */}
      <CandidateFilterBar />

      {/* Tabel Kandidat */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Pelamar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Melamar Pekerjaan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pendidikan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gaji Ekspektasi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status Keseluruhan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktivitas Terakhir
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {DUMMY_CANDIDATES.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-gray-50">
                {/* Nama Pelamar */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    <User className="w-6 h-6 rounded-full mr-3 text-indigo-400 bg-indigo-50 p-1" />
                    {candidate.name}
                  </div>
                </td>

                {/* Pekerjaan yang Dilamar */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {candidate.jobApplied}
                </td>

                {/* Pendidikan */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {candidate.education}
                </td>

                {/* Gaji */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Rp {candidate.expectedSalary.toLocaleString("id-ID")}
                </td>

                {/* Status Keseluruhan */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      candidate.overallStatus
                    )}`}
                  >
                    {candidate.overallStatus}
                  </span>
                </td>

                {/* Last Activity */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {candidate.lastActivity}
                </td>

                {/* Aksi (Detail dan CV) */}
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex space-x-3 justify-center">
                    <button
                      title="Lihat CV"
                      onClick={() => alert(`Melihat CV ${candidate.name}`)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                    <Link
                      href={`/dashboard/candidates/${candidate.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Lihat Histori Kandidat"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidatesPage;
