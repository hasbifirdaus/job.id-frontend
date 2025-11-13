// src/components/jobs/JobListTable.tsx

import React from "react";
import Link from "next/link";
import { Eye } from "lucide-react";

// Tipe Data Dummy
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

// Komponen Toggle (Sederhana)
const StatusToggle: React.FC<{ isPublished: boolean; jobId: string }> = ({
  isPublished,
  jobId,
}) => (
  <button
    // Di sini Anda akan memanggil API untuk mengubah status
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
  return (
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
          {DUMMY_JOBS.map((job) => (
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

              {/* Status Toggle */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <StatusToggle isPublished={job.isPublished} jobId={job.id} />
              </td>

              {/* Tombol Detail (Link ke Dynamic Route) */}
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobListTable;
