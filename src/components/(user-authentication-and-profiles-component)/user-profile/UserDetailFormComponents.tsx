import React, { useState } from "react";
import axiosClient from "@/lib/axiosClient";

interface UpdateJobseekerDetailsResponse {
  message: string;
  data?: any;
}

export default function UserDetailForm({ userData, setUserData }: any) {
  const [details, setDetails] = useState({
    dob: userData.dob || "",
    gender: userData.gender || "",
    education: userData.education || "",
    address: userData.address || "", //
  });

  const [loading, setLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    // Map id frontend ke key state backend (dob -> dob, latestEducation -> education, currentAddress -> address)
    const backendKey =
      id === "latestEducation"
        ? "education"
        : id === "currentAddress"
        ? "address"
        : id;

    setDetails((prev) => ({ ...prev, [backendKey]: value }));
  };

  // Endpoint 6: Update Detail Khusus Job Seeker (PUT /api/profile/jobseeker-details)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDetailError("");
    setLoading(true);

    try {
      const payload = {
        dob: details.dob,
        gender: details.gender, // "MALE" | "FEMALE" | "OTHER" (Pastikan nilai select sesuai!)
        education: details.education,
        address: details.address,
      };

      const response = await axiosClient.put<UpdateJobseekerDetailsResponse>(
        "/profile/jobseeker-details",
        payload
      );

      // Update state setelah sukses
      setUserData((prev: any) => ({ ...prev, ...details }));
      alert(response.data.message);
    } catch (error: any) {
      setDetailError(
        error.response?.data?.message || "Gagal menyimpan detail tambahan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 sticky top-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Detail Informasi Tambahan
        {/* <p className="text-sm text-red-500 font-normal">
          Wajib diisi oleh Job Seeker
        </p> */}
      </h2>
      {detailError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{detailError}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (Fields input sama) ... */}

        {/* Tempat Tanggal Lahir */}
        <div>
          <label
            htmlFor="dob"
            className="block text-sm font-medium text-gray-700"
          >
            Tanggal Lahir
          </label>
          <input
            type="date"
            id="dob" // Menggunakan 'dob' untuk sinkronisasi state
            value={details.dob}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            disabled={loading}
          />
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700"
          >
            Jenis Kelamin
          </label>
          <select
            id="gender"
            value={details.gender}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            disabled={loading}
          >
            {/* Pastikan VALUE sesuai dengan enum Prisma: MALE, FEMALE, OTHER */}
            <option value="">Pilih</option>
            <option value="MALE">Laki-laki</option>
            <option value="FEMALE">Perempuan</option>
            <option value="OTHER">Lainnya</option>
          </select>
        </div>

        {/* Pendidikan Terakhir */}
        <div>
          <label
            htmlFor="education"
            className="block text-sm font-medium text-gray-700"
          >
            Pendidikan Terakhir
          </label>
          <input
            type="text"
            id="education" // Menggunakan 'education' untuk sinkronisasi state
            value={details.education}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            disabled={loading}
          />
        </div>

        {/* Alamat Domisili Terkini */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Alamat Domisili Terkini
          </label>
          <textarea
            id="address" // Menggunakan 'address' untuk sinkronisasi state
            rows={3}
            value={details.address}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            disabled={loading}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan Detail Tambahan"}
        </button>
      </form>
    </div>
  );
}
