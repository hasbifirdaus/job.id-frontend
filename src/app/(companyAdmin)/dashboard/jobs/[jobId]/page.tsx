"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MapPin, Banknote, Clock, Users } from "lucide-react";
import {
  ClientJobsService,
  JobDetailResponse,
} from "@/service/JobsService.client";
import JobDetailTabs from "@/components/jobs/jobDetailTabs";

// Definisikan tipe Job State yang akan menyimpan data yang sudah diformat
interface JobState {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: string;
  deadline: string;
  applicantsCount: number;
}

const INITIAL_JOB_STATE: JobState = {
  id: 0,
  title: "Memuat...",
  description: "",
  location: "Memuat...",
  salary: "Memuat...",
  deadline: "Memuat...",
  applicantsCount: 0,
};

// Fungsi pembantu untuk format angka ke Rupiah tanpa desimal
const formatToRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0, // Ini menghilangkan ,00
  }).format(amount);
};

const JobDetailPage: React.FC = () => {
  const params = useParams();
  const jobIdStr = params.jobId as string;
  const jobIdNum = jobIdStr ? Number(jobIdStr) : null;

  const [job, setJob] = useState<JobState>(INITIAL_JOB_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobIdNum || isNaN(jobIdNum)) {
      setError("ID Lowongan tidak valid.");
      setIsLoading(false);
      return;
    }

    const fetchJobDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result: JobDetailResponse =
          await ClientJobsService.getJobDetailById(jobIdNum);

        // --- Transformasi Data ---
        const formattedJob: JobState = {
          id: result.id,
          title: result.title,
          description: result.description,
          // Menggunakan data City dan Contract Type
          location: `${result.city.name} (${result.contract_type.replace(
            "_",
            " "
          )})`,

          // >>> PERBAIKAN FORMAT GAJI DI SINI <<<
          salary: `${formatToRupiah(result.min_salary)} - ${formatToRupiah(
            result.max_salary
          )}`,
          // >>> AKHIR PERBAIKAN FORMAT GAJI <<<

          // Format tenggat waktu
          deadline: new Date(result.deadline).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          applicantsCount: result._count.applications,
        };

        setJob(formattedJob);
      } catch (err: any) {
        console.error("Gagal memuat detail lowongan:", err);
        setError(
          `Gagal memuat data lowongan: ${
            err.message || "Terjadi kesalahan koneksi."
          }`
        );
        setJob({ ...INITIAL_JOB_STATE, title: "Data Tidak Ditemukan" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobIdStr]);

  // Tampilkan loading state
  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Memuat detail lowongan...
      </div>
    );
  }

  // Tampilkan error state
  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  // Tampilkan UI setelah data berhasil diambil
  return (
    <div className="space-y-6">
      {/* Detail Pekerjaan */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>

        <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-indigo-500" /> {job.location}
          </div>
          <div className="flex items-center">
            {/* Ikon DollarSign masih relevan, meskipun menggunakan Rupiah */}
            <Banknote className="w-4 h-4 mr-1 text-indigo-500" /> {job.salary}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-indigo-500" /> Tenggat:{" "}
            {job.deadline}
          </div>
          <div className="flex items-center font-semibold text-gray-700">
            <Users className="w-4 h-4 mr-1 text-green-600" />{" "}
            {job.applicantsCount} Pelamar
          </div>
        </div>

        {/* <p className="mt-4 text-gray-700 whitespace-pre-line">
          {job.description}
        </p> */}
      </div>

      {/* Navigasi Tab */}
      <JobDetailTabs jobId={jobIdStr} />
    </div>
  );
};

export default JobDetailPage;
