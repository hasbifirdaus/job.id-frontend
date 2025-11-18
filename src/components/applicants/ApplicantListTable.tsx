import React, { useState } from "react";
import { User, Filter, Eye, Check, X, ArrowRight, Video } from "lucide-react";

interface Applicant {
  id: string;
  name: string;
  photoUrl: string;
  age: number;
  education: string;
  expectedSalary: number;
  status: "Applied" | "Processed" | "Interviewed" | "Accepted" | "Rejected";
  submissionDate: string;
}

// Data dummy
const DUMMY_APPLICANTS: Applicant[] = [
  {
    id: "a001",
    name: "Budi Santoso",
    photoUrl: "/img/budi.jpg",
    age: 28,
    education: "S1 Teknik",
    expectedSalary: 18000000,
    status: "Interviewed",
    submissionDate: "2025-10-20",
  },
  {
    id: "a002",
    name: "Sarah Lestari",
    photoUrl: "/img/sarah.jpg",
    age: 24,
    education: "S1 Desain",
    expectedSalary: 12000000,
    status: "Applied",
    submissionDate: "2025-10-21",
  },
  {
    id: "a003",
    name: "Rizky Alamsyah",
    photoUrl: "/img/rizky.jpg",
    age: 32,
    education: "S2 Informatika",
    expectedSalary: 25000000,
    status: "Processed",
    submissionDate: "2025-10-18",
  },
];

const getStatusColor = (status: Applicant["status"]) => {
  switch (status) {
    case "Applied":
      return "bg-blue-100 text-blue-800";
    case "Processed":
      return "bg-yellow-100 text-yellow-800";
    case "Interviewed":
      return "bg-purple-100 text-purple-800";
    case "Accepted":
      return "bg-green-100 text-green-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ApplicantListTable: React.FC<{ jobId: string }> = ({ jobId }) => {
  // === State untuk filter ===
  const [filters, setFilters] = useState({
    status: "",
    name: "",
    education: "",
  });

  // Filter data berdasarkan state filters
  const filteredApplicants = DUMMY_APPLICANTS.filter((a) => {
    return (
      (filters.status === "" || a.status === filters.status) &&
      (filters.name === "" ||
        a.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.education === "" || a.education === filters.education)
    );
  });

  return (
    <div className="space-y-4">
      {/* Filter Pelamar */}
      <div className="flex flex-wrap items-center space-x-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <select
          className="border rounded-lg p-2 text-sm"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Semua Status</option>
          <option value="Applied">Applied</option>
          <option value="Processed">Processed</option>
          <option value="Interviewed">Interviewed</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input
          type="text"
          placeholder="Filter Nama..."
          className="border rounded-lg p-2 text-sm"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />

        <select
          className="border rounded-lg p-2 text-sm"
          value={filters.education}
          onChange={(e) =>
            setFilters({ ...filters, education: e.target.value })
          }
        >
          <option value="">Pendidikan</option>
          <option value="S1 Teknik">S1 Teknik</option>
          <option value="S1 Desain">S1 Desain</option>
          <option value="S2 Informatika">S2 Informatika</option>
        </select>
      </div>

      {/* Tabel Pelamar */}
      {filteredApplicants.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Belum ada pelamar sesuai filter
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Pelamar
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Gaji Ekspektasi
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Dokumen
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-8 h-8 rounded-full mr-3 text-gray-400 bg-gray-100 p-1" />
                      <div className="text-sm font-medium text-gray-900">
                        {applicant.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rp {applicant.expectedSalary.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        applicant.status
                      )}`}
                    >
                      {applicant.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => alert("Menampilkan Preview CV")}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center justify-center mx-auto text-sm"
                      title="Preview CV"
                    >
                      <Eye className="w-4 h-4 mr-1" /> Lihat CV
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex space-x-1 justify-center">
                      <button
                        title="Panggil Interview"
                        className="p-1 text-purple-600 hover:text-purple-800"
                      >
                        <Video className="w-5 h-5" />
                      </button>
                      <button
                        title="Terima"
                        className="p-1 text-green-600 hover:text-green-800"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        title="Tolak"
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button
                        title="Proses"
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicantListTable;
