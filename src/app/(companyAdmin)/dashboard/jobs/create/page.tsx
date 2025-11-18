"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import {
  ListPlus,
  Briefcase,
  MapPin,
  Clock,
  FileText,
  Send,
  Loader2,
  Tag as TagIcon,
  Upload,
  Link,
  X,
  Save,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";

interface CustomAxiosError extends Error {
  isAxiosError: true;
  response?: {
    data: any;
    status: number;
    statusText: string;
    headers: any;
  };
  config: any;
}

interface Option {
  id: string | number;
  name: string;
}

const isAxiosError = (error: unknown): error is CustomAxiosError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as any).isAxiosError === true
  );
};

// ===============================
// Utility
// ===============================

const cleanNumber = (value: string): string => {
  let cleaned = value.replace(/[^0-9]/g, "");

  if (cleaned.length > 1 && cleaned.startsWith("0")) {
    cleaned = cleaned.replace(/^0+/, "");
  }
  if (cleaned === "0") {
    return "";
  }

  return cleaned;
};

const formatSalary = (value: string): string => {
  if (!value) return "";

  const cleanedValue = value.replace(/[^0-9]/g, "");

  const parts = cleanedValue.toString().split(".");

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return parts.join(".");
};

// ===============================
// Type Definitions
// ===============================
interface Option {
  id: string | number;
  name: string;
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  label: string;
  formattedValue?: string;
}

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon: React.ReactNode;
  label: string;
  options: Option[];
}

interface TextAreaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon: React.ReactNode;
  label: string;
}

interface BannerImageInputProps {
  label: string;
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  onFileUpload: (file: File) => Promise<boolean>;
  uploading: boolean;
}
interface UploadImageResponse {
  url: string;
  message?: string;
}
interface JobResponse {
  id: number;
  title: string;
  description?: string;
  banner_image_url?: string;
  category_id?: number;
  city_id?: number;
  min_salary?: number;
  max_salary?: number;
  deadline?: string;
  is_published: boolean;
  contract_type?: string;
  tags?: string[];
}

// ===============================
// Component Utama: CreateJobPage
// ===============================
export default function CreateJobPage() {
  const router = useRouter();
  const { user } = useAuth();

  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const jobIdToEdit = editId ? Number(editId) : undefined;
  const isEditMode = !!jobIdToEdit;

  const [loading, setLoading] = useState(false);
  const [loadingInitialData, setLoadingInitialData] = useState(isEditMode);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    banner_image_url: "",
    category_id: "",
    city_id: "",
    min_salary: "",
    max_salary: "",
    deadline: "",
    is_published: false,
    contract_type: "",
    tags: [] as string[],
    tagInput: "",
  });

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;

      if (name === "min_salary" || name === "max_salary") {
        const cleanedValue = cleanNumber(value);
        setForm((prev) => ({ ...prev, [name]: cleanedValue }));
        return;
      }

      setForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleImageUrlChange = (url: string) => {
    setForm((prev) => ({ ...prev, banner_image_url: url }));
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // 1. Fetch Categories
        // ASUMSI: Endpoint Express.js adalah /api/categories
        const categoriesResponse = await axiosClient.get<{ data: any[] }>(
          // Pastikan path ini benar. Jika API base url adalah /api,
          // maka ini akan memanggil /api/categories
          "/category"
        );
        const transformedCategories: Option[] =
          categoriesResponse.data.data.map((c) => ({
            id: c.id.toString(),
            name: c.name,
          }));
        setCategories(transformedCategories);

        // 2. Fetch Cities

        const citiesResponse = await axiosClient.get<{ data: any[] }>("/city");

        const transformedCities: Option[] = citiesResponse.data.data.map(
          (c) => ({
            id: c.id.toString(),
            name: c.name,
          })
        );
        setCities(transformedCities);
      } catch (error) {
        console.error("Failed to fetch categories or cities:", error);
      }
    };

    fetchOptions();
  }, []);

  const fetchJobData = useCallback(
    async (id: number) => {
      setLoadingInitialData(true);
      try {
        const response = await axiosClient.get<{ data: JobResponse }>(
          `/jobPosting/${id}`
        );
        const data = response.data.data;

        const transformedTags = (data.tags || [])
          .map((item: any) => {
            if (
              typeof item === "object" &&
              item !== null &&
              "tag" in item &&
              item.tag &&
              typeof item.tag.name === "string"
            ) {
              return item.tag.name;
            }

            if (typeof item === "string") {
              return item;
            }
            return null;
          })
          .filter((tag): tag is string => tag !== null);

        setForm({
          title: data.title,
          description: data.description || "",
          banner_image_url: data.banner_image_url || "",
          category_id: data.category_id?.toString() || "",
          city_id: data.city_id?.toString() || "",
          min_salary: data.min_salary?.toString() || "",
          max_salary: data.max_salary?.toString() || "",
          deadline: data.deadline
            ? new Date(data.deadline).toISOString().substring(0, 16)
            : "",
          is_published: data.is_published,
          contract_type: data.contract_type || "",
          tags: transformedTags,
          tagInput: "",
        });
      } catch (error) {
        console.error("Failed to fetch job data for edit:", error);
        alert("Gagal memuat data lowongan untuk diedit.");
        router.push("/dashboard/jobs"); // Redirect kembali
      } finally {
        setLoadingInitialData(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (jobIdToEdit) {
      fetchJobData(jobIdToEdit);
    }
  }, [jobIdToEdit, fetchJobData]);

  const handleFileUpload = async (file: File) => {
    const MAX_SIZE_MB = 2;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (file.size > MAX_SIZE_BYTES) {
      alert(
        `Ukuran file melebihi batas maksimum ${MAX_SIZE_MB}MB. Ukuran file: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)} MB`
      );
      return false;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosClient.post<UploadImageResponse>(
        "/upload/image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const uploadedUrl = response.data.url;
      setForm((prev) => ({ ...prev, banner_image_url: uploadedUrl }));

      return true;
    } catch (error: unknown) {
      // ============================
      // SAFE ERROR HANDLER (Menggunakan isAxiosError manual)
      // ============================
      if (isAxiosError(error)) {
        // Akses 'response.data.message' yang lebih aman
        const msg =
          (error.response?.data as any)?.message || "Gagal mengunggah gambar.";
        alert(msg);
        console.error("UPLOAD ERROR:", error.response?.data);
      } else {
        const msg =
          error && typeof error === "object" && "message" in error
            ? (error as any).message
            : "Terjadi kesalahan yang tidak diketahui.";
        console.error(msg);
        alert(`Error: ${msg}`);
      }

      setForm((prev) => ({ ...prev, banner_image_url: "" }));
      return false;
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    if (!form.tagInput.trim()) return;
    if (form.tags.includes(form.tagInput.trim())) return;

    setForm((prev) => ({
      ...prev,
      tags: [...prev.tags, prev.tagInput.trim()],
      tagInput: "",
    }));
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };
  // ...

  const handleSubmit = async () => {
    if (uploading) {
      alert("Mohon tunggu proses upload gambar selesai sebelum submit.");
      return;
    }

    // Validasi Gaji: Jika diisi, min harus <= max
    if (form.min_salary && form.max_salary) {
      const min = Number(form.min_salary);
      const max = Number(form.max_salary);
      if (min > max) {
        alert("Gaji minimum tidak boleh lebih besar dari gaji maksimum.");
        return;
      }
    }

    // Tentukan aksi dan pesan berdasarkan status is_published
    const action = isEditMode
      ? form.is_published
        ? "Update & Publish"
        : "Update Draft"
      : form.is_published
      ? "Publish"
      : "Save as Draft";

    const successMessage = isEditMode
      ? "Job Posting berhasil diperbarui!"
      : form.is_published
      ? "Job Posting berhasil dipublikasikan!"
      : "Job Posting berhasil disimpan sebagai draft!";

    const apiMethod = isEditMode ? axiosClient.put : axiosClient.post;
    const apiUrl = isEditMode ? `/jobPosting/${jobIdToEdit}` : "/jobPosting";

    try {
      setLoading(true);

      // Payload menggunakan angka bersih dari state
      const payload = {
        title: form.title,
        description: form.description,
        banner_image_url: form.banner_image_url || null,
        // Pastikan konversi ke Number hanya jika string tidak kosong
        category_id: form.category_id ? Number(form.category_id) : null,
        city_id: form.city_id ? Number(form.city_id) : null,
        min_salary: form.min_salary ? Number(form.min_salary) : null,
        max_salary: form.max_salary ? Number(form.max_salary) : null,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
        is_published: form.is_published,
        tags: form.tags,
        contract_type: form.contract_type || null,
        company_id: user?.company_id ?? null,
      };

      // Catatan untuk Hasbi (Backend): Pastikan Express.js/Prisma menerima
      // category_id dan city_id sebagai Number atau null jika diizinkan kosong.
      // (Karena Anda Hasbi, saya ulangi poin ini untuk Anda!)
      await apiMethod(apiUrl, payload);

      alert(successMessage);
      router.push("/dashboard/jobs");
    } catch (error: any) {
      const status = error.response?.status || "N/A"; // TANGKAP STATUS
      // Ambil pesan utama dari backend
      const backendMessage =
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        error.message;

      console.error(
        `ERROR ${action.toUpperCase()} JOB (Status: ${status}):`, // TAMBAHKAN STATUS
        backendMessage
      );

      // Menggunakan pesan backend untuk alert
      alert(
        error.response?.data?.message ||
          `Failed to ${action.toLowerCase()} job posting. Status: ${status}`
      );
    } finally {
      setLoading(false);
    }
  };

  const submitButtonIcon = form.is_published ? <Send /> : <Save size={20} />;
  const submitButtonText = form.is_published
    ? "Submit & Publish Job Posting"
    : "Save as Draft";
  const submitButtonColor = form.is_published
    ? "bg-green-600 hover:bg-green-700"
    : "bg-blue-600 hover:bg-blue-700";

  const pageTitle = isEditMode
    ? "Edit Lowongan Kerja"
    : "Create New Job Posting";

  if (loadingInitialData) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 text-center pt-20">
        <Loader2
          className="animate-spin mx-auto mb-4 text-blue-600"
          size={32}
        />
        <p className="text-xl text-gray-700">Memuat data lowongan...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <ListPlus className="text-blue-600" /> {pageTitle}
      </h1>

      <div className="space-y-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        {/* Title */}
        <InputField
          icon={<Briefcase />}
          label="Job Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g., Senior Software Engineer (Node.js)"
        />

        {/* Banner Image */}
        <BannerImageInput
          label="Banner Image (Maks. 2MB)"
          imageUrl={form.banner_image_url}
          onImageUrlChange={handleImageUrlChange}
          onFileUpload={handleFileUpload}
          uploading={uploading}
        />

        {/* Description */}
        <TextAreaField
          icon={<FileText />}
          label="Job Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Write a detailed job description..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <SelectField
            icon={<TagIcon />}
            label="Category"
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            options={categories}
          />

          {/* City */}
          <SelectField
            icon={<MapPin />}
            label="City"
            name="city_id"
            value={form.city_id}
            onChange={handleChange}
            options={cities}
          />
        </div>

        {/* Contract Type */}
        <SelectField
          icon={<Clock />}
          label="Contract Type"
          name="contract_type"
          value={form.contract_type}
          onChange={handleChange}
          options={[
            { id: "FULL_TIME", name: "Full Time" },
            { id: "PART_TIME", name: "Part Time" },
            { id: "INTERNSHIP", name: "Internship" },
            { id: "CONTRACT", name: "Contract" },
            { id: "REMOTE", name: "Remote" },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Minimum Salary */}
          <InputField
            icon={<TagIcon />}
            label="Minimum Salary (IDR)"
            name="min_salary"
            // Menggunakan formattedValue untuk menampilkan nilai yang diformat
            formattedValue={formatSalary(form.min_salary)}
            onChange={handleChange}
            // Mengubah type ke text agar pemformatan bisa ditampilkan
            type="text"
            placeholder="e.g. 5.000.000"
          />

          {/* Maximum Salary */}
          <InputField
            icon={<TagIcon />}
            label="Maximum Salary (IDR)"
            name="max_salary"
            // Menggunakan formattedValue untuk menampilkan nilai yang diformat
            formattedValue={formatSalary(form.max_salary)}
            onChange={handleChange}
            // Mengubah type ke text agar pemformatan bisa ditampilkan
            type="text"
            placeholder="e.g. 10.000.000"
          />
        </div>

        {/* Deadline */}
        <InputField
          icon={<Clock />}
          label="Application Deadline"
          type="datetime-local"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
        />

        {/* Tags */}
        <div className="flex flex-col gap-2 p-3 border rounded-lg bg-gray-50">
          <label className="font-medium flex items-center gap-2 text-gray-700">
            <TagIcon size={18} className="text-purple-600" /> Job Tags/Skills
          </label>
          <div className="flex gap-2">
            <input
              className="border p-2 rounded-lg w-full focus:ring-purple-500 focus:border-purple-500"
              placeholder="Add tag (e.g., JavaScript, React)"
              value={form.tagInput}
              onChange={(e) => setForm({ ...form, tagInput: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <button
              type="button"
              className="bg-purple-600 px-4 py-2 text-white rounded-lg hover:bg-purple-700 transition-colors flex-shrink-0"
              onClick={addTag}
            >
              Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap min-h-[20px] pt-1">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="bg-purple-100 text-purple-800 py-1 px-3 rounded-full flex items-center gap-2 text-xs font-medium"
              >
                {tag}
                <button
                  type="button"
                  className="text-purple-600 hover:text-red-800 transition-colors"
                  onClick={() => removeTag(tag)}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <hr className="my-4" />

        {/* Published Checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is-published"
            checked={form.is_published}
            onChange={(e) =>
              setForm({ ...form, is_published: e.target.checked })
            }
            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label
            htmlFor="is-published"
            className="text-lg font-semibold text-gray-800"
          >
            Publish Job Immediately
          </label>
        </div>

        {/* Submit Button */}
        <button
          disabled={loading || uploading}
          onClick={handleSubmit}
          className={`w-full ${submitButtonColor} text-white py-3 rounded-lg flex justify-center items-center gap-2 text-lg font-semibold transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed mt-6 shadow-md`}
        >
          {loading || uploading ? (
            <>
              <Loader2 className="animate-spin" />
              {uploading ? "Uploading Image..." : "Processing..."}
            </>
          ) : (
            <>
              {submitButtonIcon} {submitButtonText}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ===============================
// Reusable Components
// ===============================

// InputField diubah untuk menerima formattedValue
const InputField: React.FC<InputFieldProps> = ({
  icon,
  label,
  formattedValue,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium flex items-center gap-2 text-gray-700">
        {icon} {label}
      </label>
      <input
        {...props}
        // Jika formattedValue ada, gunakan itu sebagai nilai tampilan
        value={formattedValue !== undefined ? formattedValue : props.value}
        className="border p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
      />
    </div>
  );
};

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  icon,
  label,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium flex items-center gap-2 text-gray-700">
        {icon} {label}
      </label>
      <textarea
        {...props}
        rows={5}
        className="border p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
      ></textarea>
    </div>
  );
};

const SelectField: React.FC<SelectFieldProps> = ({
  icon,
  label,
  options,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium flex items-center gap-2 text-gray-700">
        {icon} {label}
      </label>
      <select
        {...props}
        className="border p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 bg-white"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const BannerImageInput: React.FC<BannerImageInputProps> = ({
  label,
  imageUrl,
  onImageUrlChange,
  onFileUpload,
  uploading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [useUrlInput, setUseUrlInput] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Jika ada imageUrl, default ke mode URL input, jika tidak, default ke upload
    setUseUrlInput(!!imageUrl);
  }, [imageUrl]);

  const handleFile = async (file: File | null) => {
    if (file) {
      setUseUrlInput(false);
      await onFileUpload(file);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImageUrlChange("");
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const clearImage = () => {
    onImageUrlChange("");
    setUseUrlInput(false);
  };

  const renderContent = () => {
    if (uploading) {
      return (
        <div className="flex items-center justify-center h-24 text-blue-600 bg-blue-50 border border-blue-300 rounded-lg shadow-sm">
          <Loader2 className="animate-spin mr-3" size={24} />
          <span className="text-lg font-medium">Uploading... Please wait.</span>
        </div>
      );
    }

    if (imageUrl && !useUrlInput) {
      const filename = imageUrl.split("/").pop() || "Uploaded File";
      return (
        <div className="flex items-center justify-between p-3 border-2 border-green-500 bg-green-50 rounded-lg shadow-sm">
          <span className="truncate text-sm font-medium text-green-700 flex items-center">
            <Link size={16} className="inline mr-2 text-green-600" />
            **Uploaded:** {filename}
          </span>
          <button
            type="button"
            onClick={clearImage}
            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full bg-white shadow"
            title="Remove File"
          >
            <X size={20} />
          </button>
        </div>
      );
    }

    return (
      <div
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors text-center min-h-[100px] shadow-sm 
            ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400 bg-white"
            }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{ pointerEvents: useUrlInput ? "none" : "auto" }}
      >
        <Upload size={30} className="text-gray-500 mb-2" />
        <p className="text-sm text-gray-600 font-semibold">
          **Drag & drop** file di sini, atau **klik untuk memilih** file.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          (Format: JPG, PNG. Max size: 2MB)
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onFileSelect}
          className="hidden"
          accept="image/png, image/jpeg"
          disabled={uploading}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between mb-1">
        <label className="font-medium flex items-center gap-2 text-gray-700">
          <FileText /> {label}
        </label>
        <button
          type="button"
          onClick={() => {
            setUseUrlInput((prev) => !prev);
            onImageUrlChange(""); // Clear URL when switching mode
          }}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50 transition-colors"
          disabled={uploading}
        >
          {useUrlInput ? (
            <span className="flex items-center gap-1">
              <Upload size={16} /> Upload File
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Link size={16} /> Gunakan URL
            </span>
          )}
        </button>
      </div>

      {useUrlInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="Masukkan URL Gambar Banner (misal: https://example.com/image.jpg)"
            className="border p-2 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            value={imageUrl}
            onChange={(e) => onImageUrlChange(e.target.value)}
            disabled={uploading}
          />
          {imageUrl && (
            <button
              type="button"
              onClick={clearImage}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 flex items-center transition-colors flex-shrink-0"
              title="Clear URL"
              disabled={uploading}
            >
              <X size={20} />
            </button>
          )}
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
};
