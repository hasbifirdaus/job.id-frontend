// src/components/jobs/JobListTable.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import JobFilterBar from "./JobFilterBar";
import { Eye } from "lucide-react";
import Link from "next/link";

// Tipe Data
interface JobPost {
  id: string;
  title: string;
  category: string;
  applicants: number;
  deadline: string;
  isPublished: boolean;
}

// Data Dummy
const DUMMY_JOBS: JobPost[] = [
  {
    id: "101",
    title: "Senior Frontend Developer",
    category: "Technology",
    applicants: 45,
    deadline: "15 Nov 2025",
    isPublished: true,
  },
  {
    id: "102",
    title: "Marketing Specialist",
    category: "Marketing",
    applicants: 68,
    deadline: "20 Nov 2025",
    isPublished: true,
  },
  {
    id: "103",
    title: "HR Manager",
    category: "HR",
    applicants: 12,
    deadline: "01 Dec 2025",
    isPublished: false,
  },
  {
    id: "104",
    title: "Financial Analyst",
    category: "Finance",
    applicants: 22,
    deadline: "10 Dec 2025",
    isPublished: true,
  },
];

// Komponen Toggle Status
const StatusToggle: React.FC<{ isPublished: boolean; jobId: string }> = ({
  isPublished,
  jobId,
}) => (
  <button
    onClick={() => console.log(`Toggle status untuk Job ID: ${jobId}`)}
    className={`px-3 py-1 text-xs font-semibold rounded-full transition duration-150 ${
      isPublished
        ? "bg-green-100 text-green-800 hover:bg-green-200"
        : "bg-red-100 text-red-800 hover:bg-red-200"
    }`}
  >
    {isPublished ? "Published" : "Draft"}
  </button>
);

const JobListTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOption, setSortOption] = useState("");

  // Debounce search agar tidak update setiap ketikan
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Filter dan sorting data
  const filteredJobs = useMemo(() => {
    let jobs = [...DUMMY_JOBS];

    // Search
    if (debouncedSearch) {
      jobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Filter kategori
    if (categoryFilter) {
      jobs = jobs.filter((job) => job.category === categoryFilter);
    }

    // Sorting
    if (sortOption === "Newest") {
      jobs.sort(
        (a, b) =>
          new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
      );
    } else if (sortOption === "Oldest") {
      jobs.sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      );
    } else if (sortOption === "Most Applicants") {
      jobs.sort((a, b) => b.applicants - a.applicants);
    }

    return jobs;
  }, [debouncedSearch, categoryFilter, sortOption]);

  const categories = Array.from(new Set(DUMMY_JOBS.map((job) => job.category)));
  const sortOptions = ["Newest", "Oldest", "Most Applicants"];

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <JobFilterBar
        categories={categories}
        sortOptions={sortOptions}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategoryFilter}
        onSortChange={setSortOption}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Judul Pekerjaan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pelamar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenggat Waktu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredJobs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Data belum tersedia
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {job.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.applicants}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.deadline}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusToggle
                      isPublished={job.isPublished}
                      jobId={job.id}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="text-indigo-600 hover:text-indigo-900 flex justify-center items-center"
                      title="Lihat Detail & Kelola Pelamar"
                    >
                      <Eye className="w-4 h-4 mr-1" /> Detail
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobListTable;
