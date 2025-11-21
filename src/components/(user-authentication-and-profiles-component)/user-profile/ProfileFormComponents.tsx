import React, { useState, useRef } from "react";
import axiosClient from "@/lib/axiosClient";

interface UpdatePhotoResponse {
  data: {
    profile_image_url: string;
  };
}

interface UpdatePersonalResponse {
  data: {
    name: string;
  };
}

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ALLOWED_EXTENSIONS = ["image/jpeg", "image/jpg", "image/png"];

// ... (Fungsi validateImage sama) ...
const validateImage = (file: File): { isValid: boolean; message: string } => {
  if (!ALLOWED_EXTENSIONS.includes(file.type)) {
    return {
      isValid: false,
      message:
        "Ekstensi file tidak valid. Hanya .jpg, .jpeg, .png yang diperbolehkan.",
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      message: "Ukuran file terlalu besar. Maksimum 1MB.",
    };
  }
  return { isValid: true, message: "" };
};

export default function ProfileForm({ userData, setUserData }: any) {
  const [name, setName] = useState(userData.name);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [personalError, setPersonalError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Endpoint 3: Update Foto Profil (PUT /api/profile/photo)
  const handlePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const validation = validateImage(file);

      if (!validation.isValid) {
        setPhotoError(validation.message);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setPhotoError("");
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("profile_image", file); // Key harus 'profile_image' sesuai Multer di backend

        const response = await axiosClient.put<UpdatePhotoResponse>(
          "/profile/photo",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Update URL di state setelah sukses
        setUserData((prev: any) => ({
          ...prev,
          profile_image_url: response.data.data.profile_image_url,
        }));
        alert("Foto profil berhasil diperbarui!");
      } catch (error: any) {
        setPhotoError(
          error.response?.data?.message || "Gagal mengupload foto."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // Endpoint 2: Update Data Personal (PUT /api/profile/personal)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalError("");
    setLoading(true);

    // Kumpulkan data yang akan dikirim (hanya yang diubah)
    const payload: {
      name?: string;
      oldPassword?: string;
      newPassword?: string;
    } = {};

    if (name !== userData.name) {
      payload.name = name;
    }
    if (oldPassword && newPassword) {
      payload.oldPassword = oldPassword;
      payload.newPassword = newPassword;
    } else if (oldPassword || newPassword) {
      setPersonalError(
        "Untuk mengubah password, kedua field (lama & baru) wajib diisi."
      );
      setLoading(false);
      return;
    }

    if (Object.keys(payload).length === 0) {
      setPersonalError("Tidak ada data yang diubah.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosClient.put<UpdatePersonalResponse>(
        "/profile/personal",
        payload
      );

      // Update state nama
      setUserData((prev: any) => ({ ...prev, name: response.data.data.name }));

      // Reset password field setelah sukses
      setOldPassword("");
      setNewPassword("");
      alert("Data personal berhasil diperbarui!");
    } catch (error: any) {
      setPersonalError(
        error.response?.data?.message || "Gagal memperbarui data personal."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Data Personal
      </h2>

      {/* Error Umum */}
      {personalError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{personalError}</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Foto Profil */}
        <div className="flex items-center space-x-4">
          <img
            className="h-16 w-16 rounded-full object-cover"
            src={
              userData.profile_image_url ||
              "/img/jobseeker/user-profile/user-image-profile-default.jpg"
            }
            alt="Foto Profil"
          />
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              className="hidden"
              accept=".jpg, .jpeg, .png"
              id="profile-picture"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Mengunggah..." : "Ubah Foto"}
            </button>
            {photoError && (
              <p className="text-red-500 text-xs mt-1">{photoError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Max 1MB. Format: JPG, JPEG, PNG.
            </p>
          </div>
        </div>
        {/* ... (Nama Lengkap dan Password fields sama) ... */}

        {/* Nama Lengkap */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nama Lengkap
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Update Password Section */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Ubah Password
          </h3>
          <div>
            <label
              htmlFor="old-password"
              className="block text-sm font-medium text-gray-700"
            >
              Password Lama
            </label>
            <input
              type="password"
              id="old-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700"
            >
              Password Baru
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
