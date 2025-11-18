"use client";

import React, {
  useState,
  useMemo,
  ChangeEvent,
  useEffect,
  useCallback,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ClientJobsService,
  JobListingResponse,
} from "@/service/JobsService.client";
import {
  ClientCategoryService,
  CategoryResponse,
} from "@/service/CategoryService.client";

import ConfirmationModal from "../utils/ConfirmationModal";

// --- Definisi Tipe (Interfaces) ---

interface JobPosting {
  id: number;
  title: string;
  category: string;
  location: string;
  applicants: number;
  isPublished: boolean;
  deadline: string;
}

interface SortConfig {
  // Tambahkan key sorting yang ada di API dan yang disort lokal
  key: keyof JobPosting | "id" | "title" | "deadline" | "category" | "location";
  direction: "ascending" | "descending";
}

const JobPostingList: React.FC = () => {
  const [jobsData, setJobsData] = useState<JobPosting[]>([]); // data yang ditransformasi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobIdToDelete, setJobIdToDelete] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: "",
    // Menggunakan string 'All' atau category ID (sebagai string untuk HTMLSelectElement)
    categoryId: "All",
    isPublished: "All", // String 'All', 'Published', atau 'Draft'
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "deadline",
    direction: "descending",
  });
  const router = useRouter();

  const [categoryOptions, setCategoryOptions] = useState<CategoryResponse[]>(
    []
  );

  // Categories untuk drop-down filter
  const categories = useMemo(() => {
    return [
      { id: "All", name: "Semua Kategori" }, // Ubah ID menjadi string untuk kemudahan handling di <select>
      ...categoryOptions.map((c) => ({
        // Ganti STATIC_CATEGORIES_MAP dengan categoryOptions
        id: c.id.toString(),
        name: c.name,
      })),
    ];
    // === [4] GANTI DEPENDENSI useMemo ===
  }, [categoryOptions]);

  // --- Handlers ---
  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Sesuaikan name di select filter untuk mencocokkan state: categoryId
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await ClientCategoryService.getAllCategories(); // Panggil API
        setCategoryOptions(result); // Simpan di state
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const requestSort = (key: SortConfig["key"]) => {
    let direction: SortConfig["direction"] = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortConfig["key"]) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? " ▲" : " ▼";
  };

  // (togglePublishStatus, handleDelete, handleViewDetail tetap sama)
  const handleViewDetail = (jobId: number) => {
    router.push(`/dashboard/jobs/${jobId}`);
  };

  const togglePublishStatus = async (jobId: number, currentStatus: boolean) => {
    try {
      // Pastikan memanggil API dengan await dan memanggil fetchJobs dengan await
      await ClientJobsService.togglePublishStatus(jobId, !currentStatus);
      await fetchJobs();
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
    }
  };

  const handleOpenDeleteModal = (jobId: number) => {
    setJobIdToDelete(jobId);
    setIsModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setJobIdToDelete(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!jobIdToDelete) return;

    handleCloseDeleteModal(); // Tutup modal saat proses dimulai

    try {
      // Tidak perlu lagi window.confirm
      await ClientJobsService.deleteJob(jobIdToDelete);
      await fetchJobs();
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  // --- Data Fetching (Sinkronisasi dengan Backend) ---
  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Persiapkan parameter API
      const apiParams: any = {
        q: filters.title || undefined,
        // Mapping key sorting, 'applicants' disort lokal, tapi API perlu field lain
        sortBy: sortConfig.key === "applicants" ? "created_at" : sortConfig.key,
        sortDir: sortConfig.direction === "ascending" ? "asc" : "desc",
      };

      // 2. Tambahkan Filter Kategori (category ID)
      if (filters.categoryId !== "All") {
        // Kirim ID sebagai Number, sesuai ListJobsParams di ClientJobsService.client.ts
        apiParams.category_id = Number(filters.categoryId);
      }

      // 3. Tambahkan Filter Status Publikasi (is_published)
      if (filters.isPublished !== "All") {
        // Kirim sebagai Boolean, sesuai ListJobsParams di ClientJobsService.client.ts
        apiParams.is_published = filters.isPublished === "Published";
      }

      // Panggil Client Service
      const result = await ClientJobsService.getJobList(apiParams);

      // Transformasi data untuk tampil di table
      const transformedJobs: JobPosting[] = result.items.map(
        (item: JobListingResponse) => ({
          id: item.id,
          title: item.title,
          category: item.category.name,
          location: item.city.name,
          applicants: item._count.applications,
          isPublished: item.is_published,
          // Format deadline agar lebih mudah dibaca
          deadline: new Date(item.deadline).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        })
      );
      setJobsData(transformedJobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobsData([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortConfig]); // Dependensi: filters dan sortConfig

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // --- Sorting Lokal untuk applicants --- (Tetap sama)
  const filteredAndSortedJobs = useMemo(() => {
    // Jika sorting di kolom lain, kembalikan jobsData (karena sudah disort API)
    if (sortConfig.key === "applicants") {
      const sorted = [...jobsData].sort((a, b) => {
        const aValue = a.applicants;
        const bValue = b.applicants;
        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
      return sorted;
    }
    return jobsData; // Data sudah disort oleh API untuk kolom lain
  }, [jobsData, sortConfig]);

  // Fungsi helper untuk render header kolom yang bisa disort
  const renderSortableHeader = (
    key: SortConfig["key"],
    label: string,
    isAlignRight = false
  ) => (
    <th
      className={`px-6 py-3 text-${
        isAlignRight ? "right" : "left"
      } text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition duration-150`}
      onClick={() => requestSort(key)}
    >
      {label}
      {getSortIcon(key)}
    </th>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* --- Header & New Job Button (Opsional) --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Daftar Lowongan Kerja
        </h1>
        <Link href="/dashboard/jobs/create">
          <button className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300">
            + Lowongan Baru
          </button>
        </Link>
      </div>

      {/* --- Filter Section --- */}
      <section className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          🔍 Filter Data
        </h2>
        <div className="flex space-x-4">
          <input
            type="text"
            name="title"
            placeholder="Filter berdasarkan Judul Lowongan"
            value={filters.title}
            onChange={handleFilterChange}
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            name="categoryId"
            value={filters.categoryId}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-lg"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            name="isPublished"
            value={filters.isPublished}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-lg"
          >
            <option value="All">Semua Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </section>

      {/* --- Table Section --- */}
      {isLoading ? (
        <div className="text-center py-10 text-lg text-gray-500">
          Memuat data lowongan...
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {renderSortableHeader("title", "Title")}
                {renderSortableHeader("category", "Category")}
                {renderSortableHeader("applicants", "Applicants", false)}
                {renderSortableHeader("deadline", "Deadline")}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedJobs.length > 0 ? (
                filteredAndSortedJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-indigo-50 transition duration-150"
                  >
                    {/* ... (Kolom data lowongan) ... */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-semibold">
                      {job.applicants} User
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.deadline}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {/* ... (Toggle Status Button) ... */}
                      <span
                        onClick={() =>
                          togglePublishStatus(job.id, job.isPublished)
                        }
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition duration-300 ${
                          job.isPublished
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        }`}
                        title="Klik untuk mengubah status"
                      >
                        {job.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/* ... (Action Buttons) ... */}
                      <button
                        onClick={() => handleViewDetail(job.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-150"
                        title="Lihat Detail Lowongan & Daftar Pelamar"
                      >
                        Detail
                      </button>
                      <Link
                        href={`/dashboard/jobs/create?editId=${job.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition duration-150"
                        title="Perbarui Lowongan"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleOpenDeleteModal(job.id)}
                        className="text-red-600 hover:text-red-900 transition duration-150"
                        title="Hapus Lowongan"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    Tidak ada lowongan yang ditemukan dengan kriteria filter
                    saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Penghapusan"
        message={`Apakah Anda yakin ingin menghapus lowongan?`}
        confirmText="Ya, Hapus"
      />
    </div>
  );
};

export default JobPostingList;
