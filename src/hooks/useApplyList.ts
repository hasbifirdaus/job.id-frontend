// src/hooks/useApplications.ts

import { useState, useEffect, useCallback } from "react";
import { fetchUserApplications, ApplicationItem } from "@/lib/api/applyList";

interface UseApplicationsState {
  applications: ApplicationItem[];
  loading: boolean;
  error: string | null;
  total: number;
  refresh: () => void;
}

const useApplications = (
  page: number,
  limit: number,
  status: string | null,
  searchTerm: string
): UseApplicationsState => {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((prev) => prev + 1), []);

  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        // Catatan: Backend Anda saat ini tidak mendukung 'searchTerm' langsung.
        // Logika pencarian harus dilakukan di frontend setelah data diambil,
        // atau Anda perlu memodifikasi service backend untuk menerima dan memfilter berdasarkan search term.

        // Kita hanya akan mengirim filter status, page, dan limit ke backend.
        const data = await fetchUserApplications({
          page,
          limit,
          status: status || undefined,
        });

        // Filtering Search Term dilakukan di frontend (Jika tidak diimplementasikan di backend)
        const filteredItems = data.items.filter(
          (app) =>
            app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.companyName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Perlu diperhatikan: Jika Anda mengimplementasikan pagination,
        // total harus disaring di backend juga. Untuk saat ini, kita akan
        // menggunakan total dari backend untuk semua data yang ada.

        setApplications(filteredItems);
        setTotal(data.total); // Total hanya untuk seluruh data yang difilter status, bukan search term
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat mengambil data.");
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [page, limit, status, searchTerm, refreshKey]); // Tambahkan searchTerm dan refreshKey

  return { applications, loading, error, total, refresh };
};

export default useApplications;
