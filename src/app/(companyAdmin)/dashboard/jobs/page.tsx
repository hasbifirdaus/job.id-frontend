"use client";

import React from "react";
import JobPostingList from "@/components/jobs/JobPostingList";

const JobPostingsPage: React.FC = () => {
  // Dalam implementasi nyata, di sini Anda akan menggunakan hooks (misalnya: useJobs)
  // untuk mengambil data lowongan dari API dan mengelola state filtering/sorting.

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Manajemen Lowongan Kerja
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <JobPostingList />
      </div>
    </div>
  );
};

export default JobPostingsPage;
