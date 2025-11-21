"use client";

import React from "react";
import JobFilterBar from "@/components/jobs/JobFilterBar";
import JobListTable from "@/components/jobs/JobListTable";

const JobPostingsPage: React.FC = () => {
  // Dalam implementasi nyata, di sini Anda akan menggunakan hooks (misalnya: useJobs)
  // untuk mengambil data lowongan dari API dan mengelola state filtering/sorting.

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Manajemen Lowongan Kerja
      </h1>

      {/* 1. Filter dan Pencarian */}
      {/* Mengimplementasikan Filtering berdasarkan title dan category, serta Sorting */}
      <JobFilterBar />

      {/* 2. Daftar Lowongan */}
      {/* Mengimplementasikan Job Posting List, Status Toggle, dan link ke detail */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <JobListTable />
      </div>
    </div>
  );
};

export default JobPostingsPage;
