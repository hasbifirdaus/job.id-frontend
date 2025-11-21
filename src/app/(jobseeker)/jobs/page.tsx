"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Search,
  MapPin,
  Banknote,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  X,
} from "lucide-react";
// Pastikan axiosClient telah dikonfigurasi dengan benar
import axiosClient from "@/lib/axiosClient";

/* ============================================================
 * TIPE DATA & KONSTANTA
 * ============================================================ */

const DEFAULT_COMPANY_IMAGE = "/img/logo/company-image-default.jpg";

interface JobFromAPI {
  id: number;
  title: string;
  min_salary: number | null;
  max_salary: number | null;
  contract_type: string | null;
  deadline: string;
  category: { name: string };
  city: { name: string };
  // **TAMBAHAN:** Field untuk banner dari backend
  banner_image_url?: string | null;
  company: { name: string; logo_image_url?: string | null };
  created_at: string;
  tags: { tag: { name: string } }[];
}

interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

interface Option {
  label: string;
  value: string; // Ini akan menjadi SLUG atau NAMA yang dikirim ke backend
}

interface DynamicFilterOptions {
  category: Option[];
  tags: Option[];
  type: Option[];
  salaryRange: Option[];
}

interface JobListing {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  category: string;
  postedDate: string;
  postedTimestamp: number;
  deadline: string;
  isExpired: boolean;
  min_salary?: number | null;
  max_salary?: number | null;
  tags: string[];
  companyImage?: string | null; // Logo perusahaan
  bannerImage?: string | null; // **TAMBAHAN:** URL banner pekerjaan
}

const STATIC_FILTER_OPTIONS: Omit<DynamicFilterOptions, "category" | "tags"> = {
  type: [
    { label: "Full Time", value: "FULL_TIME" },
    { label: "Part Time", value: "PART_TIME" },
    { label: "Contract", value: "CONTRACT" },
    { label: "Internship", value: "INTERNSHIP" },
  ],
  salaryRange: [
    { label: "< 5jt", value: "<5" },
    { label: "5-10jt", value: "5-10" },
    { label: "10-15jt", value: "10-15" },
    { label: "15jt+", value: ">15" },
  ],
};

const SORT_OPTIONS = [
  { label: "Terbaru", value: "latest" },
  { label: "Gaji Tertinggi", value: "highest" },
  { label: "Gaji Terendah", value: "lowest" },
];

const SORT_MAPPING: Record<string, string> = {
  newest: "latest", // Dibiarkan jika ada di backend
  latest: "latest",
  oldest: "oldest", // Dibiarkan jika ada di backend
  highest: "highest",
  lowest: "lowest",
};

/* ============================================================
 * TOAST SYSTEM
 * ============================================================ */

type ToastType = "success" | "error" | "info";
type ToastItem = { id: string; type?: ToastType; message: string };

const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = useCallback((message: string, type: ToastType = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((s) => [...s, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  return { toasts, pushToast, removeToast };
};

const Toast: React.FC<ToastItem & { onClose: (id: string) => void }> = ({
  id,
  type = "info",
  message,
  onClose,
}) => {
  useEffect(() => {
    const t = setTimeout(() => onClose(id), 4000);
    return () => clearTimeout(t);
  }, [id, onClose]);

  const bg =
    type === "error"
      ? "bg-red-600"
      : type === "success"
      ? "bg-green-600"
      : "bg-gray-800";

  return (
    <div className={`px-4 py-2 rounded-md shadow-md text-white ${bg}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1 text-sm">{message}</div>
        <button onClick={() => onClose(id)} className="opacity-80">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const ToastContainer: React.FC<{
  toasts: ToastItem[];
  onClose: (id: string) => void;
}> = ({ toasts, onClose }) => (
  <div className="fixed right-4 top-4 z-50 flex flex-col gap-3">
    {toasts.map((t) => (
      <Toast key={t.id} {...t} onClose={onClose} />
    ))}
  </div>
);

/* ============================================================
 * CUSTOM HOOK: useJobData
 * ============================================================ */

type FiltersType = {
  category: string[];
  type: string[];
  salaryRange: string[];
  tags: string[];
};

type ParamsState = {
  searchTerm: string; // State UI
  searchLocation: string; // State UI
  filters: FiltersType;
  sortBy: string;
  page: number;
  limit: number;
};

// State yang dikirim ke API setelah debounce
type DebouncedParams = {
  title: string;
  city: string;
};

const INITIAL_STATE: ParamsState = {
  searchTerm: "",
  searchLocation: "",
  filters: { category: [], type: [], salaryRange: [], tags: [] },
  sortBy: "latest",
  page: 1,
  limit: 10,
};

const mapSalaryRangeToMinMax = (rangeValue: string) => {
  // Semua nilai diubah menjadi jutaan, lalu dikalikan 1.000.000
  if (rangeValue === "<5") {
    return { min: 0, max: 5_000_000 };
  }
  if (rangeValue === ">15") {
    // Batas bawah 15 juta, batas atas tak terbatas
    return { min: 15_000_000, max: undefined };
  }
  const match = rangeValue.match(/(\d+)-(\d+)/);
  if (match) {
    return {
      min: Number(match[1]) * 1_000_000,
      max: Number(match[2]) * 1_000_000,
    };
  }
  return {};
};

interface ApiOption {
  id: number;
  name: string;
}

const useJobData = () => {
  const { pushToast } = useToast();
  const [state, setState] = useState<ParamsState>(INITIAL_STATE);
  const [debouncedParams, setDebouncedParams] = useState<DebouncedParams>({
    title: "",
    city: "",
  });
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // State untuk menyimpan opsi filter dinamis (dari backend)
  const [filterOptions, setFilterOptions] = useState<DynamicFilterOptions>({
    category: [],
    tags: [],
    ...STATIC_FILTER_OPTIONS,
  });
  const [loadingFilters, setLoadingFilters] = useState(true);

  // --- DEBOUNCE EFFECT FOR SEARCH INPUTS ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedParams({
        title: state.searchTerm,
        city: state.searchLocation,
      });
      // Reset page ke 1 saat pencarian berubah
      setState((s) => ({ ...s, page: 1 }));
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [state.searchTerm, state.searchLocation]);

  // --- FETCHING FILTER DINAMIS (DIPANGGIL HANYA SEKALI) ---
  const fetchFilters = useCallback(async () => {
    setLoadingFilters(true);
    try {
      const [categoryRes, tagsRes] = await Promise.all([
        axiosClient.get<ApiResponse<ApiOption[]>>("/jobs/getAllCategories"),
        axiosClient.get<ApiResponse<ApiOption[]>>("/jobs/getAllTags"),
      ]);

      const fetchedCategories: Option[] = (categoryRes.data.data ?? []).map(
        (c) => ({
          label: c.name,
          value: c.name, // Menggunakan NAME sebagai value yang dikirim ke backend
        })
      );

      const fetchedTags: Option[] = (tagsRes.data.data ?? []).map((t) => ({
        label: t.name,
        value: t.name, // Menggunakan NAME sebagai value yang dikirim ke backend
      }));

      setFilterOptions((s) => ({
        ...s,
        category: fetchedCategories,
        tags: fetchedTags,
      }));
    } catch (err) {
      console.error("fetchFilters error:", err);
      pushToast(
        "Gagal memuat opsi filter (Kategori/Tags). Cek endpoint routing.",
        "error"
      );
    } finally {
      setLoadingFilters(false);
    }
  }, [pushToast]);

  useEffect(() => {
    // Muat filter saat komponen dimuat
    fetchFilters();
  }, [fetchFilters]);

  // --- ACTIONS ---

  const setPage = (page: number) =>
    setState((s) => ({ ...s, page: Math.max(1, Math.min(page, totalPages)) }));

  // Mengubah parameter search/location di UI (akan memicu debounce)
  const setParam = (key: keyof ParamsState, value: string) => {
    setState((s) => ({ ...s, [key]: value }));
  };

  // Mengubah parameter filter/sort (langsung memicu API call via buildQueryParams deps)
  const setSortBy = (value: string) =>
    setState((s) => ({ ...s, sortBy: value, page: 1 }));

  const handleFilterChange = (name: keyof FiltersType, optionValue: string) => {
    setState((prev) => {
      const arr = prev.filters[name];
      const newArr = arr.includes(optionValue)
        ? arr.filter((v) => v !== optionValue)
        : [...arr, optionValue];
      // Selalu reset ke halaman 1 saat filter berubah
      return { ...prev, filters: { ...prev.filters, [name]: newArr }, page: 1 };
    });
  };

  const handleClearFilters = () => {
    setState((s) => ({
      ...INITIAL_STATE,
      limit: s.limit,
      sortBy: s.sortBy, // Pertahankan sortBy
      searchTerm: s.searchTerm, // Pertahankan searchTerm UI
      searchLocation: s.searchLocation, // Pertahankan searchLocation UI
    }));
    // Note: Debounced params akan tetap sama, hanya filter yang direset
  };

  // --- QUERY BUILDING ---

  const buildQueryParams = useCallback(() => {
    const params: Record<string, any> = {
      title: debouncedParams.title || undefined,
      city: debouncedParams.city || undefined,
      page: state.page,
      limit: state.limit,
      sort: SORT_MAPPING[state.sortBy],
    };

    const filters = state.filters;

    // Filter yang menggunakan koma-separated string
    if (filters.category.length) params.category = filters.category.join(",");
    if (filters.type.length) params.contractType = filters.type.join(",");
    if (filters.tags.length) params.tag = filters.tags.join(",");

    // Filter Gaji (Min/Max Salary)
    if (filters.salaryRange.length) {
      let minSalaryBackend: number | undefined;
      let maxSalaryBackend: number | undefined;

      // Cari batas bawah terendah dan batas atas tertinggi dari SEMUA filter gaji yang dipilih
      filters.salaryRange.forEach((rangeVal) => {
        const { min, max } = mapSalaryRangeToMinMax(rangeVal);

        if (min !== undefined) {
          minSalaryBackend =
            minSalaryBackend === undefined
              ? min
              : Math.min(minSalaryBackend, min);
        }

        if (max !== undefined) {
          maxSalaryBackend =
            maxSalaryBackend === undefined
              ? max
              : Math.max(maxSalaryBackend, max);
        }
        // Jika filter ">15jt" dipilih, minSalaryBackend akan menjadi 15jt
        // dan maxSalaryBackend akan tetap undefined (batas atas tak terbatas)
      });

      if (minSalaryBackend !== undefined) params.minSalary = minSalaryBackend;
      if (maxSalaryBackend !== undefined) params.maxSalary = maxSalaryBackend;
    }

    return Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined)
    );
  }, [state.page, state.limit, state.sortBy, state.filters, debouncedParams]);

  // --- FETCHING JOBS ---

  const fetchJobs = useCallback(async () => {
    setLoading(true); // Mulai loading

    try {
      const params = buildQueryParams();

      const res = await axiosClient.get<ApiResponse<JobFromAPI[]>>(
        "/jobs/discover",
        { params }
      );
      const api = res.data;

      const totalPagesCalculated = Math.max(
        1,
        Math.ceil((api.meta?.total ?? 0) / state.limit)
      );

      // PERBAIKAN KRITIS: Sinkronisasi halaman
      if (state.page > totalPagesCalculated && totalPagesCalculated > 0) {
        // Cukup perbarui state halaman, ini akan memicu panggilan ulang fetchJobs
        // Setelah ini, eksekusi akan dilanjutkan ke blok finally untuk set loading=false
        setState((s) => ({ ...s, page: totalPagesCalculated }));
      } else {
        // Jika halaman valid, perbarui data dan total
        setTotalJobs(api.meta?.total ?? 0);
        setTotalPages(totalPagesCalculated);

        const parsed: JobListing[] = api.data.map((job) => {
          const created = new Date(job.created_at);
          const deadline = new Date(job.deadline);
          const isExpired = deadline.getTime() < Date.now();

          const formatSalary = (min: number | null, max: number | null) => {
            if (min !== null && max !== null) {
              const formatter = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              });
              // Memformat menjadi 5 Juta - 10 Juta (Contoh: Rp5.000.000 - Rp10.000.000)
              return `${formatter.format(min)} - ${formatter.format(max)}`;
            } else if (min !== null) {
              const formatter = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              });
              return `> ${formatter.format(min)}`;
            }
            return "Gaji tidak ditampilkan";
          };

          const formatDate = (date: Date) =>
            date.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });

          return {
            id: job.id,
            title: job.title,
            company: job.company?.name ?? "-",
            location: job.city?.name ?? "-",
            category: job.category?.name ?? "-",
            type: job.contract_type ?? "UNKNOWN",
            salary: formatSalary(job.min_salary, job.max_salary),
            postedDate: formatDate(created),
            postedTimestamp: created.getTime(),
            deadline: deadline.toLocaleDateString("id-ID"),
            isExpired,
            min_salary: job.min_salary,
            max_salary: job.max_salary,
            tags: job.tags?.map((t) => t.tag.name) || [],
            companyImage: job.company?.logo_image_url ?? null,
            // **TAMBAHAN:** Masukkan URL banner ke field baru
            bannerImage: job.banner_image_url ?? null,
          };
        });

        setJobs(parsed);
      }
    } catch (err: any) {
      console.error("fetchJobs error:", err);
      pushToast(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal memuat data lowongan.",
        "error"
      );
      setTotalJobs(0);
      setTotalPages(1);
      setJobs([]);
    } finally {
      // Pastikan loading dimatikan, walaupun ada error atau update halaman.
      setLoading(false);
    }
  }, [
    buildQueryParams,
    pushToast,
    state.limit,
    state.page,
    state.searchTerm,
    state.searchLocation,
  ]);

  // Efek ini dipicu setiap kali parameter query berubah
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    loading,
    totalJobs,
    totalPages,
    currentPage: state.page,
    currentFilters: state.filters,
    searchTerm: state.searchTerm,
    searchLocation: state.searchLocation,
    sortBy: state.sortBy,
    filterOptions,
    loadingFilters, // Status loading filter dinamis dari backend
    setPage,
    setParam,
    setSortBy,
    handleFilterChange,
    handleClearFilters,
  };
};

/* ============================================================
 * Job Card Component
 * ============================================================ */
const JobCard: React.FC<{ job: JobListing }> = ({ job }) => {
  // **LOGIKA PRIORITAS GAMBAR BARU**
  const imageSrc = useMemo(() => {
    // Prioritas 1: Logo Perusahaan
    if (job.companyImage) return job.companyImage;
    // Prioritas 2: Banner Pekerjaan
    if (job.bannerImage) return job.bannerImage;
    // Prioritas 3: Default
    return DEFAULT_COMPANY_IMAGE;
  }, [job.companyImage, job.bannerImage]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-blue-500/30 transition border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-start gap-4 flex-1">
        {/* BAGIAN GAMBAR PERUSAHAAN */}
        <img
          // Gunakan imageSrc yang sudah memiliki logika prioritas
          src={imageSrc}
          alt={`${job.company} logo`}
          className="w-14 h-14 object-contain rounded-xl border p-1 flex-shrink-0 bg-white"
          onError={(e) => {
            e.currentTarget.onerror = null; // prevents looping
            e.currentTarget.src = DEFAULT_COMPANY_IMAGE; // Fallback jika URL gagal dimuat
          }}
        />

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
              <Banknote size={14} className="text-green-600" /> {job.salary}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} className="text-yellow-600" /> {job.type}
            </span>
          </div>

          {/* Display Tags */}
          <div className="mt-2 flex flex-wrap gap-1">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-3">
            <span
              className={`text-xs px-2 py-1 rounded-md font-medium ${
                job.isExpired
                  ? "bg-red-200 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              Deadline: {job.deadline}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start md:items-end space-y-2">
        <span className="text-xs text-gray-500">
          Diposting: {job.postedDate}
        </span>

        <a
          href={`/jobs/${job.id}`}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-[1.02] shadow-md"
        >
          Lihat Detail
        </a>

        {/* INFORMASI KATEGORI */}
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
          {job.category}
        </span>
      </div>
    </div>
  );
};

/* ============================================================
 * FilterSection
 * ============================================================ */
interface FilterSectionProps {
  title: string;
  options: Option[];
  selected: string[]; // array of values
  onSelect: (optionValue: string) => void;
  isLoading?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  selected,
  onSelect,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-lg font-semibold text-gray-700 hover:text-blue-600 transition"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        {title}
        {isLoading ? (
          <RefreshCw size={20} className="animate-spin text-blue-500" />
        ) : isOpen ? (
          <ChevronUp size={20} />
        ) : (
          <ChevronDown size={20} />
        )}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2">
          {isLoading ? (
            <p className="text-sm text-gray-500 italic">Memuat opsi...</p>
          ) : options.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              Tidak ada opsi ditemukan.
            </p>
          ) : (
            options.map((option, idx) => (
              <div
                key={`${title}-${option.value}`}
                className="flex items-center"
              >
                <input
                  id={`${title}-${option.value}-${idx}`}
                  type="checkbox"
                  checked={selected.includes(option.value)}
                  onChange={() => onSelect(option.value)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor={`${title}-${option.value}-${idx}`}
                  className="ml-3 text-sm text-gray-600 cursor-pointer hover:text-gray-800"
                >
                  {option.label}
                </label>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

/* ============================================================
 * MAIN PAGE: JobListPage
 * ============================================================ */

export default function JobListPage() {
  const {
    jobs,
    loading,
    totalJobs,
    totalPages,
    currentPage,
    currentFilters,
    searchTerm,
    searchLocation,
    sortBy,
    filterOptions,
    loadingFilters,
    setPage,
    setParam,
    setSortBy,
    handleFilterChange,
    handleClearFilters,
  } = useJobData();

  const { toasts, removeToast } = useToast();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Cek apakah ada filter yang aktif (selain pencarian dan sort)
  const isFilterActive = useMemo(
    () => Object.values(currentFilters).some((arr) => arr.length > 0),
    [currentFilters]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Semua Lowongan Pekerjaan
          </h1>
          <p className="text-gray-600 mt-2">
            Ditemukan{" "}
            <span className="font-bold text-blue-600">{totalJobs}</span>{" "}
            lowongan.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white p-4 rounded-xl shadow-lg border mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Judul / Perusahaan"
                value={searchTerm}
                onChange={(e) => setParam("searchTerm", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg"
              />
            </div>

            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Lokasi (mis: Jakarta)"
                value={searchLocation}
                onChange={(e) => setParam("searchLocation", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border px-4 py-3 rounded-lg cursor-pointer"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center gap-2"
            >
              <Filter size={18} /> Filter
            </button>

            <button
              onClick={handleClearFilters}
              // Tambahkan warna berbeda jika ada filter aktif
              className={`hidden md:flex px-4 py-3 rounded-lg gap-2 items-center font-medium transition ${
                isFilterActive
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <RefreshCw size={18} /> Reset
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden md:block w-64 bg-white rounded-xl shadow border p-5 h-fit sticky top-24">
            <h2 className="font-bold text-lg mb-4">Filter</h2>

            {/* Filter Kategori (DINAMIS DARI BACKEND) */}
            <FilterSection
              title="Kategori"
              options={filterOptions.category}
              selected={currentFilters.category}
              onSelect={(v) => handleFilterChange("category", v)}
              isLoading={loadingFilters}
            />

            {/* Filter Tipe Pekerjaan (STATIS) */}
            <FilterSection
              title="Tipe Pekerjaan"
              options={filterOptions.type}
              selected={currentFilters.type}
              onSelect={(v) => handleFilterChange("type", v)}
            />

            {/* Filter Range Gaji (STATIS) */}
            <FilterSection
              title="Range Gaji"
              options={filterOptions.salaryRange}
              selected={currentFilters.salaryRange}
              onSelect={(v) => handleFilterChange("salaryRange", v)}
            />

            {/* Filter Tags (DINAMIS DARI BACKEND) */}
            <FilterSection
              title="Tags"
              options={filterOptions.tags}
              selected={currentFilters.tags}
              onSelect={(v) => handleFilterChange("tags", v)}
              isLoading={loadingFilters}
            />

            <button
              onClick={handleClearFilters}
              className={`mt-4 w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition ${
                isFilterActive
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <RefreshCw size={18} /> Reset Filter
            </button>
          </div>

          {/* Mobile Filters */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end">
              <div
                // Perlu menambahkan keyframe animate-slide-left di file CSS global (tailwind config)
                className="w-72 bg-white h-full p-6 overflow-y-auto shadow-xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-lg">Filter</h2>
                  <button
                    onClick={() => {
                      setMobileFilterOpen(false);
                    }}
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Filter Kategori (Mobile, DINAMIS) */}
                <FilterSection
                  title="Kategori"
                  options={filterOptions.category}
                  selected={currentFilters.category}
                  onSelect={(v) => handleFilterChange("category", v)}
                  isLoading={loadingFilters}
                />

                {/* Filter Tipe Pekerjaan (Mobile, STATIS) */}
                <FilterSection
                  title="Tipe Pekerjaan"
                  options={filterOptions.type}
                  selected={currentFilters.type}
                  onSelect={(v) => handleFilterChange("type", v)}
                />

                {/* Filter Range Gaji (Mobile, STATIS) */}
                <FilterSection
                  title="Range Gaji"
                  options={filterOptions.salaryRange}
                  selected={currentFilters.salaryRange}
                  onSelect={(v) => handleFilterChange("salaryRange", v)}
                />

                {/* Filter Tags (Mobile, DINAMIS) */}
                <FilterSection
                  title="Tags"
                  options={filterOptions.tags}
                  selected={currentFilters.tags}
                  onSelect={(v) => handleFilterChange("tags", v)}
                  isLoading={loadingFilters}
                />

                <button
                  onClick={() => {
                    handleClearFilters();
                    setMobileFilterOpen(false);
                  }}
                  className={`mt-6 w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition ${
                    isFilterActive
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <RefreshCw size={18} /> Reset Filter
                </button>
              </div>
            </div>
          )}

          {/* Job List */}
          <div className="flex-1 space-y-6">
            {loading ? (
              <div className="text-center py-10">
                <RefreshCw
                  size={24}
                  className="animate-spin mx-auto text-blue-500 mb-2"
                />
                <p className="text-gray-600">Memuat lowongan...</p>
              </div>
            ) : jobs.length === 0 ? (
              <p className="text-center text-gray-600 py-10 border rounded-xl bg-white shadow">
                Tidak ada lowongan ditemukan berdasarkan kriteria Anda.
              </p>
            ) : (
              jobs.map((job) => <JobCard key={job.id} job={job} />)
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-10 p-4 bg-white rounded-xl shadow border">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setPage(currentPage - 1)}
                  className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                    currentPage <= 1
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  Previous
                </button>

                <p className="text-gray-600 text-sm">
                  Halaman <strong>{currentPage}</strong> dari{" "}
                  <strong>{totalPages}</strong>
                </p>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage(currentPage + 1)}
                  className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                    currentPage >= totalPages
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
