"use client";

import React from "react";
import { useParams } from "next/navigation";
import { MapPin, DollarSign, Clock } from "lucide-react";
import JobDetailTabs from "@/components/jobs/jobDetailTabs";

const DUMMY_JOB_DATA = {
  id: "101",
  title: "Senior Frontend Developer",
  description:
    "Kami mencari Senior Frontend Developer yang mahir dalam Next.js, React, dan Tailwind CSS untuk memimpin pengembangan dashboard internal.",
  location: "Jakarta, Indonesia",
  salary: "Rp 15.000.000 - Rp 25.000.000",
  deadline: "15 November 2025",
};

const JobDetailPage: React.FC = () => {
  const params = useParams();
  const jobId = params.jobId as string;

  const job = DUMMY_JOB_DATA;

  return (
    <div className="space-y-6">
      {/* Detail Pekerjaan Sederhana */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>

        <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-indigo-500" /> {job.location}
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-1 text-indigo-500" /> {job.salary}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-indigo-500" /> Tenggat:{" "}
            {job.deadline}
          </div>
        </div>

        <p className="mt-4 text-gray-700">{job.description}</p>
      </div>

      {/* Navigasi Tab (Implementasi Fitur Manajemen) */}
      <JobDetailTabs jobId={jobId} />
    </div>
  );
};

export default JobDetailPage;
