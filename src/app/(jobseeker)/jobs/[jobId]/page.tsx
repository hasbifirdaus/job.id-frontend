// app/jobs/[jobId]/page.tsx (FULL CODE - Perbaikan Integrasi)

import { notFound } from "next/navigation";
import { getJobDetail } from "@/lib/api/jobsPage.api";
import { JobDetailFromAPI } from "@/types/jobsPage.types";
import JobDetailClient from "../../../../components/job-seeker/jobs/JobDetailClient";

// Interface untuk parameter dinamis dari Next.js App Router
interface JobDetailPageProps {
  params: {
    jobId: string; // ID lowongan pekerjaan dari URL
  };
}

// Helper untuk format gaji
const formatSalary = (min: number | null, max: number | null): string => {
  if (min === null && max === null) return "Gaji Rahasia";
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  if (min && max) {
    if (min === max) return formatter.format(min);
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }
  if (min) return `Mulai dari ${formatter.format(min)}`;
  if (max) return `Hingga ${formatter.format(max)}`;
  return "Gaji Tidak Diketahui";
};

// Next.js Server Component untuk Data Fetching
export default async function JobDetailPage({ params }: JobDetailPageProps) {
  let jobData: JobDetailFromAPI | null = null;
  let jobNotFound = false;

  try {
    // 1. Fetch data dari Backend API menggunakan jobId
    jobData = await getJobDetail(params.jobId);
  } catch (error: any) {
    console.error("Error fetching job detail:", error.message);
    jobNotFound = true;
  }

  if (jobNotFound || !jobData) {
    // Gunakan notFound() untuk memicu 404 page Next.js
    notFound();
  }

  // Persiapkan data agar sesuai dengan props client component
  const jobProps = {
    ...jobData,
    // Format ulang data yang diperlukan untuk UI
    logoUrl:
      jobData.company.logo_image_url ||
      "/img/jobseeker/jobs-page/image-company-default.jpg", // Ganti placeholder jika null
    location: `${jobData.city.name}, ${jobData.city.province.name}`,
    type: jobData.contract_type.replace("_", "-"),
    salaryDisplay: formatSalary(jobData.min_salary, jobData.max_salary),
    postedDate: new Date(jobData.published_at!).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }), // Perlu penyesuaian format tanggal lebih lanjut
    tagsList: jobData.tags.map((t) => t.tag.name),
  };

  return <JobDetailClient job={jobProps} />;
}
