// FILE: src/service/CategoryService.client.ts (Buat file ini)

import axiosClient from "@/lib/axiosClient";

export interface CategoryResponse {
  id: number;
  name: string;
}
interface BackendResponse<T> {
  message: string;
  data: T; // T akan menjadi array CategoryResponse[]
}

export const ClientCategoryService = {
  /**
   * Mengambil daftar kategori dari backend
   * Endpoint: GET /api/category
   */
  // Ubah tipe generic AxiosClient untuk menerima struktur BackendResponse
  async getAllCategories(): Promise<CategoryResponse[]> {
    const response = await axiosClient.get<BackendResponse<CategoryResponse[]>>(
      "/category"
    ); //  PERBAIKAN: Akses array yang sebenarnya dari properti 'data' kedua
    return response.data.data; // <--- SEHARUSNYA INI
  },
};
