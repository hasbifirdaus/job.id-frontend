"use client";
import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  FileText,
  User,
  Upload,
  Send,
  CheckCircle,
  Briefcase,
  GraduationCap,
  RefreshCw,
} from "lucide-react";

// Definisikan Tipe Data Dasar
interface ApplicationData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  cvFile: File | null;
  coverLetterFile: File | null;
  experienceSummary: string;
}

// Data Dummy Pekerjaan yang dilamar
const jobTitle = "Full-Stack Developer (Remote)";
const companyName = "TechNova Corp";

// Komponen UI Kustom: Input (Sesuai Struktur components/ui/Input.tsx)
// Catatan: Karena kita hanya bisa membuat satu file, kita definisikan komponen sederhana di sini.
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
}> = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  isTextArea = false,
}) => (
  <div className="flex flex-col space-y-2">
    <label htmlFor={id} className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {isTextArea ? (
      <textarea
        id={id}
        rows={4}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
      />
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-sm"
      />
    )}
  </div>
);

// Komponen UI Kustom: FileUpload (Sesuai Struktur components/ui/FileUpload.tsx)
const FileUpload: React.FC<{
  label: string;
  id: string;
  onFileChange: (file: File | null) => void;
  required?: boolean;
}> = ({ label, id, onFileChange, required = false }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFileName(file ? file.name : null);
    onFileChange(file);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex items-center space-x-4">
        <input
          id={id}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
          required={required}
        />
        <label
          htmlFor={id}
          className="flex items-center justify-center p-3 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition duration-150"
        >
          <Upload size={18} className="mr-2" /> Pilih File (.pdf, .doc)
        </label>
        <span className="text-sm text-gray-500 truncate max-w-[200px] md:max-w-none">
          {fileName || "Belum ada file terpilih"}
        </span>
      </div>
    </div>
  );
};

// Komponen Langkah 1: Info Dasar
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
        <User size={24} /> Informasi Kontak
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

// Komponen Langkah 2: Dokumen & Riwayat
const Step2: React.FC<{
  data: ApplicationData;
  setData: (data: ApplicationData) => void;
}> = ({ data, setData }) => {
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
        <FileText size={24} /> Dokumen & Pengalaman
      </h2>
      <div className="space-y-6">
        <FileUpload
          label="Unggah CV / Resume Anda"
          id="cvUpload"
          onFileChange={(file) => handleFileChange("cvFile", file)}
          required
        />
        <FileUpload
          label="Unggah Surat Lamaran (Opsional)"
          id="coverLetterUpload"
          onFileChange={(file) => handleFileChange("coverLetterFile", file)}
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

// Komponen Konfirmasi Akhir
const SubmissionSuccess: React.FC = () => (
  <div className="text-center p-10 bg-green-50 rounded-xl shadow-lg border border-green-200">
    <CheckCircle
      size={64}
      className="text-green-500 mx-auto mb-4 animate-bounce"
    />
    <h2 className="text-3xl font-bold text-green-800 mb-2">
      Lamaran Berhasil Dikirim!
    </h2>
    <p className="text-gray-700">
      Terima kasih telah melamar ke posisi **{jobTitle}** di **{companyName}**.
    </p>
    <p className="text-gray-600 mt-3">
      Kami akan meninjau aplikasi Anda dan menghubungi Anda kembali jika ada
      perkembangan.
    </p>
    <a
      href="/jobs"
      className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
    >
      <ChevronLeft size={20} className="mr-2" /> Kembali ke Daftar Pekerjaan
    </a>
  </div>
);

// Fungsi Validasi Langkah
const validateStep = (step: number, data: ApplicationData): boolean => {
  if (step === 1) {
    return !!data.fullName && !!data.email && !!data.phone;
  }
  if (step === 2) {
    return !!data.cvFile; // CV wajib diunggah
  }
  return true;
};

// ==== Halaman Utama Aplikasi Lamaran ====
export default function JobApplyPage({
  params,
}: {
  params: { jobId: string };
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Inisialisasi State Aplikasi
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    cvFile: null,
    coverLetterFile: null,
    experienceSummary: "",
  });

  const totalSteps = 2; // Hanya 2 langkah formulir

  // Konten Langkah Saat Ini
  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return <Step1 data={applicationData} setData={setApplicationData} />;
      case 2:
        return <Step2 data={applicationData} setData={setApplicationData} />;
      default:
        return null;
    }
  }, [currentStep, applicationData]);

  const handleSubmit = async () => {
    if (!validateStep(currentStep, applicationData)) {
      // Notifikasi kustom untuk validasi
      alert("Mohon lengkapi semua kolom wajib (*) sebelum melanjutkan.");
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Langkah Terakhir: Proses Submit
      setIsSubmitting(true);

      // --- Simulasi Proses API ---
      console.log("Mengirim data lamaran:", applicationData);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulasi delay API 2 detik
      // --- Akhir Simulasi Proses API ---

      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 md:py-20 flex justify-center items-start">
        <div className="max-w-xl w-full mx-4 sm:mx-6 lg:mx-8">
          <SubmissionSuccess />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Utama */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-100 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
            Melamar: {jobTitle}
          </h1>
          <p className="text-lg text-gray-600">
            Perusahaan: {companyName} | Job ID: {params.jobId}
          </p>
          <a
            href={`/jobs/${params.jobId}`}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition mt-2"
          >
            <ChevronLeft size={16} className="mr-1" /> Lihat Detail Pekerjaan
          </a>
        </div>

        {/* Status Langkah (Stepper) */}
        <div className="flex justify-between items-center mb-10">
          {[1, 2].map((step) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition duration-300 ${
                    currentStep === step
                      ? "bg-red-600 shadow-lg shadow-red-500/50"
                      : currentStep > step
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                >
                  {currentStep > step ? <CheckCircle size={20} /> : step}
                </div>
                <span
                  className={`mt-2 text-sm text-center ${
                    currentStep >= step
                      ? "font-semibold text-gray-800"
                      : "text-gray-500"
                  }`}
                >
                  {step === 1 ? "Info Dasar" : "Dokumen"}
                </span>
              </div>
              {step < totalSteps && (
                <div
                  className={`flex-1 h-1 mx-2 transition duration-300 ${
                    currentStep > step ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

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
            className={`px-8 py-3 rounded-lg font-bold text-white transition flex items-center justify-center gap-2 ${
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
                Lanjut ke Dokumen{" "}
                <ChevronLeft size={20} className="transform rotate-180" />
              </>
            ) : (
              <>
                <Send size={20} /> Selesaikan Lamaran
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
