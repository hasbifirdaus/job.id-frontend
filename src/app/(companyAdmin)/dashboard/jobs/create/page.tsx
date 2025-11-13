"use client";

import React, { useState } from "react";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  ListPlus,
  Send,
  FileText,
} from "lucide-react";

interface JobData {
  title: string;
  category: string;
  location: "remote" | "onsite" | "hybrid";
  type: "full-time" | "part-time" | "contract";
  minSalary: number;
  maxSalary: number;
  description: string;
  requirements: string;
  deadline: string;
  isPublished: boolean;
}

const CreateJobPage: React.FC = () => {
  const [formData, setFormData] = useState<JobData>({
    title: "",
    category: "Teknologi",
    location: "onsite",
    type: "full-time",
    minSalary: 0,
    maxSalary: 0,
    description: "",
    requirements: "",
    deadline: "",
    isPublished: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Khusus untuk checkbox publish
    if (type === "checkbox" && name === "isPublished") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "number" ? Number(value) : value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Data Lowongan yang Dikirim:", formData);
    alert("Lowongan berhasil disimpan! Silakan cek konsol untuk detailnya.");
    // Di sini Anda akan menambahkan logika fetch API POST ke backend
  };

  const jobCategories = [
    "Teknologi",
    "Pemasaran",
    "Keuangan",
    "Operasional",
    "HRD",
    "Desain",
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 flex items-center">
        <ListPlus className="w-7 h-7 mr-3 text-indigo-600" /> Posting Lowongan
        Baru
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-8"
      >
        {/* Bagian 1: Informasi Dasar Pekerjaan */}
        <section className="space-y-4 border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-indigo-500" /> Detail
            Pekerjaan
          </h2>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Judul Pekerjaan
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Contoh: Senior Backend Engineer"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Kategori
              </label>
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                {jobCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Tipe Kontrak
              </label>
              <select
                name="type"
                id="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
          </div>
        </section>

        {/* Bagian 2: Lokasi dan Gaji */}
        <section className="space-y-4 border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-indigo-500" /> Lokasi & Gaji
          </h2>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Model Kerja
            </label>
            <select
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="onsite">Onsite (Di Kantor)</option>
              <option value="hybrid">Hybrid</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="minSalary"
                className="block text-sm font-medium text-gray-700"
              >
                Gaji Minimum (Rp)
              </label>
              <input
                type="number"
                name="minSalary"
                id="minSalary"
                value={formData.minSalary === 0 ? "" : formData.minSalary}
                onChange={handleChange}
                placeholder="Contoh: 15000000"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="maxSalary"
                className="block text-sm font-medium text-gray-700"
              >
                Gaji Maksimum (Rp)
              </label>
              <input
                type="number"
                name="maxSalary"
                id="maxSalary"
                value={formData.maxSalary === 0 ? "" : formData.maxSalary}
                onChange={handleChange}
                placeholder="Contoh: 25000000"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </section>

        {/* Bagian 3: Deskripsi dan Persyaratan */}
        <section className="space-y-4 border-b pb-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-indigo-500" /> Deskripsi
          </h2>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Deskripsi Pekerjaan
            </label>
            <textarea
              name="description"
              id="description"
              rows={6}
              value={formData.description}
              onChange={handleChange}
              placeholder="Jelaskan tanggung jawab utama, tujuan pekerjaan, dan budaya kerja."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="requirements"
              className="block text-sm font-medium text-gray-700"
            >
              Persyaratan Utama (Gunakan poin atau list)
            </label>
            <textarea
              name="requirements"
              id="requirements"
              rows={4}
              value={formData.requirements}
              onChange={handleChange}
              placeholder="- Minimal 3 tahun pengalaman di bidang X&#10;- Mahir menggunakan Y&#10;- Gelar S1 terkait"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </section>

        {/* Bagian 4: Pengaturan Akhir */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-indigo-500" /> Batas Waktu &
            Publikasi
          </h2>

          <div className="max-w-xs">
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-gray-700"
            >
              Batas Akhir Lamaran
            </label>
            <input
              type="date"
              name="deadline"
              id="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="flex items-center pt-2">
            <input
              id="isPublished"
              name="isPublished"
              type="checkbox"
              checked={formData.isPublished}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor="isPublished"
              className="ml-2 block text-sm font-medium text-gray-900"
            >
              Langsung Publikasikan (Tampilkan di website)
            </label>
          </div>

          {/* Tombol Aksi */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center transition duration-150"
            >
              <Send className="w-5 h-5 mr-3" />
              {formData.isPublished
                ? "Publikasikan Lowongan"
                : "Simpan sebagai Draft"}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default CreateJobPage;
