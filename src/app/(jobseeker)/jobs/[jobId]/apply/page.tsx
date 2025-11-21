// JobApplyPage.tsx
"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  FileText,
  User,
  Upload,
  Send,
  CheckCircle,
  Briefcase,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Banknote,
} from "lucide-react";
import axiosClient from "@/lib/axiosClient";

interface ApplicationData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  cvFile: File | null;
  coverLetterFile: File | null;
  experienceSummary: string;
  salaryExpectation: string;
}

interface JobDetailResponse {
  title: string;
  company?: {
    name: string;
  };
}

// Batasan File — disesuaikan dengan backend (hanya PDF)
const MAX_FILE_SIZE = 2; // Maks 2 MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

// --- Utility: Fungsi Format & Parsing Gaji (Diperbarui) ---
// Hanya menangani format angka murni tanpa rentang atau 'M/juta'

/**
 * Format string/number menjadi format IDR (Rupiah) dengan pemisah ribuan.
 * Contoh: 15000000 -> IDR 15.000.000
 */
const formatRupiah = (value: string | number | null): string => {
  if (value === null || value === "") return "";
  // Hapus semua karakter non-angka
  let stringValue = String(value).replace(/[^0-9]/g, "");

  if (stringValue === "") return "";

  const numberValue = parseInt(stringValue, 10);
  if (isNaN(numberValue)) return "";

  return `IDR ${numberValue.toLocaleString("id-ID")}`;
};

/**
 * Parsing hanya untuk nilai tunggal numerik.
 * Menghapus semua karakter non-angka.
 * Mengembalikan string angka murni (tanpa format) atau null.
 * Catatan: Notasi M/Juta dan rentang diabaikan/tidak didukung lagi.
 */
const parseSingleSalary = (value: string): string | null => {
  let sanitized = value.replace(/[^0-9]/g, "");
  if (sanitized === "") return null;

  const numberValue = parseInt(sanitized, 10);
  // Validasi: tidak boleh 0
  if (isNaN(numberValue) || numberValue <= 0) return null;

  return String(numberValue);
};

const parseSalaryValue = (
  inputValue: string
): { display: string; rawValue: string | null } => {
  const singleValue = parseSingleSalary(inputValue);
  // display akan menggunakan formatRupiah, rawValue adalah angka murni
  return { display: formatRupiah(singleValue), rawValue: singleValue };
};

// --- Komponen UI Kustom ---
const CustomInput: React.FC<{
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
  isTextArea?: boolean;
  isCurrency?: boolean;
}> = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  isTextArea = false,
  isCurrency = false,
}) => (
  <div className="flex flex-col space-y-2">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {isCurrency && (
        <Banknote
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      )}
      {isTextArea ? (
        <textarea
          id={id}
          rows={4}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
          maxLength={500}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          // Tambahkan prop pattern untuk membatasi input ke angka pada browser yang mendukung (optional)
          pattern={type === "tel" && isCurrency ? "[0-9]*" : undefined}
          inputMode={type === "tel" && isCurrency ? "numeric" : undefined}
          className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm ${
            isCurrency ? "pl-10" : ""
          }`}
        />
      )}
    </div>
    {isTextArea && (
      <p className="text-xs text-gray-500 text-right">
        {value.length}/500 Karakter
      </p>
    )}
  </div>
);

// FileUpload disesuaikan: hanya menerima PDF
const FileUpload: React.FC<{
  label: string;
  id: string;
  onFileChange: (file: File | null) => void;
  required?: boolean;
  currentFile: File | null;
  setLocalError: (msg: string | null) => void;
}> = ({
  label,
  id,
  onFileChange,
  required = false,
  currentFile,
  setLocalError,
}) => {
  const fileName = currentFile ? currentFile.name : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setLocalError(null);

    if (file) {
      if (file.size > MAX_FILE_SIZE * 1024 * 1024) {
        setLocalError(
          `Ukuran file melebihi batas maksimum ${MAX_FILE_SIZE}MB.`
        );
        onFileChange(null);
        if (e.target) e.target.value = "";
        return;
      }
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        setLocalError("Tipe file tidak valid. Hanya menerima PDF.");
        onFileChange(null);
        if (e.target) e.target.value = "";
        return;
      }
    }
    onFileChange(file);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
        <span className="text-xs text-gray-500 ml-2">
          (Maks {MAX_FILE_SIZE}MB, .pdf)
        </span>
      </label>
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <input
          id={id}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor={id}
          className="flex items-center justify-center p-3 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition duration-150 min-w-[200px]"
        >
          <Upload size={18} className="mr-2" /> Pilih File
        </label>
        <span className="text-sm text-gray-500 truncate max-w-full sm:max-w-xs">
          {fileName || "Belum ada file terpilih"}
        </span>
      </div>
    </div>
  );
};

// Step components (Info, Docs, Details)
const Step1: React.FC<{
  data: ApplicationData;
  setData: (data: ApplicationData) => void;
}> = ({ data, setData }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <User size={24} className="text-blue-600" /> Informasi Kontak
      </h2>
      <p className="text-gray-600">
        Pastikan informasi kontak Anda akurat agar kami dapat menghubungi Anda.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomInput
          label="Nama Lengkap"
          id="fullName"
          value={data.fullName}
          onChange={handleChange}
          required
        />
        <CustomInput
          label="Alamat Email"
          id="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          required
        />
        <CustomInput
          label="Nomor Telepon"
          id="phone"
          type="tel"
          value={data.phone}
          onChange={handleChange}
          required
        />
        <CustomInput
          label="URL LinkedIn (Opsional)"
          id="linkedin"
          value={data.linkedin}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/..."
        />
      </div>
    </div>
  );
};

const Step2: React.FC<{
  data: ApplicationData;
  setData: (data: ApplicationData) => void;
  setFileError: (msg: string | null) => void;
}> = ({ data, setData, setFileError }) => {
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleFileChange = (
    field: keyof ApplicationData,
    file: File | null
  ) => {
    setData({ ...data, [field]: file });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <FileText size={24} className="text-blue-600" /> Dokumen & Pengalaman
      </h2>
      <div className="space-y-6">
        <FileUpload
          label="Unggah CV / Resume Anda (PDF)"
          id="cvUpload"
          onFileChange={(file) => handleFileChange("cvFile", file)}
          required
          currentFile={data.cvFile}
          setLocalError={setFileError}
        />
        <FileUpload
          label="Unggah Surat Lamaran (Opsional, PDF)"
          id="coverLetterUpload"
          onFileChange={(file) => handleFileChange("coverLetterFile", file)}
          currentFile={data.coverLetterFile}
          setLocalError={setFileError}
        />
      </div>

      <div className="pt-4 border-t border-gray-100">
        <CustomInput
          label="Ringkasan Pengalaman (Max 500 karakter)"
          id="experienceSummary"
          value={data.experienceSummary}
          onChange={handleTextChange}
          isTextArea
          placeholder="Jelaskan secara singkat pengalaman dan mengapa Anda cocok untuk posisi ini..."
        />
      </div>
    </div>
  );
};

// --- Komponen Step3 (Diperbarui) ---
const formatInputWithDots = (value: string): string => {
  // hapus semua karakter non-digit
  let digits = value.replace(/[^0-9]/g, "");
  if (digits === "" || digits === "0") return ""; // tidak boleh 0

  // ubah ke number untuk menambahkan titik ribuan
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const Step3: React.FC<{
  data: ApplicationData;
  setData: (data: ApplicationData) => void;
}> = ({ data, setData }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    if (id === "salaryExpectation") {
      // Format realtime ribuan
      const formattedValue = formatInputWithDots(value);
      setData({ ...data, [id]: formattedValue });
    } else {
      setData({ ...data, [id]: value });
    }
  };

  const { rawValue: rawSalaryValue } = useMemo(
    () => parseSalaryValue(data.salaryExpectation),
    [data.salaryExpectation]
  );

  const isSalaryValid = !!rawSalaryValue && parseInt(rawSalaryValue, 10) > 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Briefcase size={24} className="text-blue-600" /> Detail Tambahan & Gaji
      </h2>
      <p className="text-gray-600">
        Informasi ini membantu kami memahami ekspektasi Anda lebih baik.
      </p>
      <div className="grid grid-cols-1 gap-6">
        <CustomInput
          label="Ekspektasi Gaji Bulanan (Angka)"
          id="salaryExpectation"
          value={data.salaryExpectation}
          onChange={handleChange}
          placeholder="Contoh: 3.500.000"
          required
          isCurrency
          type="tel"
        />

        {!isSalaryValid && data.salaryExpectation && (
          <div className="p-3 rounded-lg border bg-red-50 border-red-200">
            <p className="text-sm text-red-600 font-medium flex items-center gap-2">
              <AlertTriangle size={18} /> Nilai gaji tidak valid atau nol.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Submission success UI
const SubmissionSuccess: React.FC<{
  jobTitle?: string;
  companyName?: string;
}> = ({ jobTitle = "posisi", companyName = "perusahaan" }) => (
  <div className="text-center p-10 bg-green-50 rounded-xl shadow-lg border border-green-200">
    <CheckCircle
      size={64}
      className="text-green-500 mx-auto mb-4 animate-bounce"
    />
    <h2 className="text-3xl font-bold text-green-800 mb-2">
      Lamaran Berhasil Dikirim!
    </h2>
    <p className="text-gray-700">
      Terima kasih telah melamar ke posisi <strong>{jobTitle}</strong> di{" "}
      <strong>{companyName}</strong>.
    </p>
    <p className="text-gray-600 mt-3">
      Kami akan meninjau aplikasi Anda dan menghubungi Anda kembali jika ada
      perkembangan.
    </p>
    <a
      href="/dashboard-user"
      className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
    >
      <ChevronRight size={20} className="mr-2" /> Lihat Daftar Lamaran Saya
    </a>
  </div>
);

// Validasi langkah (Diperbarui untuk Step 3)
const validateStep = (step: number, data: ApplicationData): boolean => {
  if (step === 1) {
    return !!data.fullName && !!data.email && !!data.phone;
  }
  if (step === 2) {
    return !!data.cvFile;
  }
  if (step === 3) {
    const { rawValue } = parseSalaryValue(data.salaryExpectation);
    // Validasi: harus ada rawValue DAN rawValue harus lebih besar dari 0
    return !!data.salaryExpectation && !!rawValue && parseInt(rawValue, 10) > 0;
  }
  return true;
};

export default function JobApplyPage() {
  const params = useParams();
  const router = useRouter();
  const jobIdParam = params?.jobId ?? null; // expected route /jobs/[jobId]/apply or similar
  const jobId = jobIdParam ? Number(jobIdParam) : null;

  const [jobTitle, setJobTitle] = useState("...");
  const [companyName, setCompanyName] = useState("...");

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [applicationData, setApplicationData] = useState<ApplicationData>({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    cvFile: null,
    coverLetterFile: null,
    experienceSummary: "",
    salaryExpectation: "",
  });

  const totalSteps = 3;

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      try {
        const res = await axiosClient.get<JobDetailResponse>(`/jobs/${jobId}`);
        setJobTitle(res.data.title);
        setCompanyName(res.data.company?.name || "Perusahaan");
      } catch (err) {
        console.error("Gagal fetch job", err);
      }
    };

    fetchJob();
  }, [jobId]);

  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return <Step1 data={applicationData} setData={setApplicationData} />;
      case 2:
        return (
          <Step2
            data={applicationData}
            setData={setApplicationData}
            setFileError={setFileError}
          />
        );
      case 3:
        return <Step3 data={applicationData} setData={setApplicationData} />;
      default:
        return null;
    }
  }, [currentStep, applicationData]);

  const resetForm = () => {
    setApplicationData({
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
      cvFile: null,
      coverLetterFile: null,
      experienceSummary: "",
      salaryExpectation: "",
    });
    setCurrentStep(1);
    setErrorMessage(null);
    setFileError(null);
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    setFileError(null);

    if (!jobId) {
      setErrorMessage(
        "Job ID tidak ditemukan. Mohon buka halaman lamaran dari halaman detail pekerjaan."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (fileError) {
      setErrorMessage(fileError);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!validateStep(currentStep, applicationData)) {
      let message = `Mohon lengkapi semua kolom wajib (*) di langkah ${currentStep} sebelum melanjutkan.`;
      if (currentStep === 3) {
        message =
          "Mohon masukkan ekspektasi gaji dengan format angka murni yang valid (contoh: 3500000) dan tidak boleh nol (0).";
      }
      setErrorMessage(message);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1);
      return;
    }

    // Final submit
    setIsSubmitting(true);
    setErrorMessage(null);

    const { rawValue: expectedSalaryRaw } = parseSalaryValue(
      applicationData.salaryExpectation
    );

    // Final check for required fields, especially salary after parsing
    if (!applicationData.cvFile || !expectedSalaryRaw) {
      setErrorMessage("CV dan Ekspektasi Gaji harus diisi.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("job_id", String(jobId));
    // Menggunakan expectedSalaryRaw yang sudah pasti angka murni dari parsing
    formData.append("expected_salary", expectedSalaryRaw);
    formData.append("fullName", applicationData.fullName);
    formData.append("email", applicationData.email);
    formData.append("phone", applicationData.phone);
    if (applicationData.linkedin)
      formData.append("linkedin", applicationData.linkedin);
    if (applicationData.experienceSummary)
      formData.append("experienceSummary", applicationData.experienceSummary);
    // cover letter text (optional)
    formData.append("coverLetter", applicationData.experienceSummary || "");

    // files
    formData.append("cv", applicationData.cvFile as File);
    if (applicationData.coverLetterFile) {
      formData.append("coverLetterFile", applicationData.coverLetterFile);
    }

    try {
      // Override Content-Type so browser sets the correct multipart boundary
      const response = await axiosClient.post("/applyjob", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // sukses
      setIsSubmitted(true);
      resetForm();

      // optionally redirect after a pause
      // router.push("/dashboard/applications");
    } catch (err: any) {
      let errMsg = "Gagal mengirim lamaran. Silakan coba lagi.";
      if (err?.response?.data?.error) errMsg = err.response.data.error;
      else if (err?.message) errMsg = err.message;
      setErrorMessage(errMsg);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrev = () => {
    setErrorMessage(null);
    setFileError(null);
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 md:py-20 flex justify-center items-start">
        <div className="max-w-xl w-full mx-4 sm:mx-6 lg:mx-8">
          <SubmissionSuccess jobTitle={jobTitle} companyName={companyName} />
        </div>
      </div>
    );
  }

  const stepLabels = ["Info Dasar", "Dokumen & CV", "Detail Tambahan"];

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Utama */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-100 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
            Melamar: {jobTitle}
          </h1>
          <p className="text-lg text-gray-600">
            Perusahaan: {companyName} | Job ID: {jobId ?? "—"}
          </p>
          <a
            href={jobId ? `/jobs/${jobId}` : "/jobs"}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition mt-2"
          >
            <ChevronLeft size={16} className="mr-1" /> Lihat Detail Pekerjaan
          </a>
        </div>

        {/* Status Langkah (Stepper) */}
        <div className="flex justify-between items-start mb-10">
          {[...Array(totalSteps)].map((_, index) => {
            const step = index + 1;
            return (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition duration-300 transform ${
                      currentStep === step
                        ? "bg-red-600 shadow-lg shadow-red-500/50 scale-110"
                        : currentStep > step
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {currentStep > step ? <CheckCircle size={20} /> : step}
                  </div>
                  <span
                    className={`mt-2 text-sm text-center truncate ${
                      currentStep >= step
                        ? "font-semibold text-gray-800"
                        : "text-gray-500"
                    }`}
                  >
                    {stepLabels[index]}
                  </span>
                </div>
                {step < totalSteps && (
                  <div
                    className={`flex-1 h-1 mt-5 mx-2 transition duration-300 ${
                      currentStep > step ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Error Message Banner */}
        {errorMessage && (
          <div
            className="p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center shadow-md"
            role="alert"
          >
            <AlertTriangle size={20} className="mr-3 flex-shrink-0" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Form Konten */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-100">
          {stepContent}
        </div>

        {/* Navigasi Footer */}
        <div className="flex justify-between mt-8 p-4 bg-white rounded-xl shadow-md border border-gray-100">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1 || isSubmitting}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              currentStep === 1 || isSubmitting
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ChevronLeft size={20} /> Sebelumnya
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-lg font-bold text-white transition flex items-center justify-center gap-2 min-w-[180px] ${
              isSubmitting
                ? "bg-blue-400 cursor-wait"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30"
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={20} className="animate-spin" /> Mengirim...
              </>
            ) : currentStep < totalSteps ? (
              <>
                Lanjut ke {stepLabels[currentStep]}
                <ChevronRight size={20} />
              </>
            ) : (
              <>
                <Send size={20} /> Kirim Lamaran
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
