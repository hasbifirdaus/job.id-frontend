import { useState, useEffect } from "react";
import axiosClient from "@/lib/axiosClient";

export interface Job {
  id: number;
  title: string;
  category: { name: string };
  city: { name: string };
  applicantsCount: number;
  deadline: string;
  is_published: boolean;
}

interface GetJobsResponse {
  data: Job[];
}

interface TogglePublishResponse {
  data: Job;
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get<GetJobsResponse>("/api/job/getJobs");
      setJobs(res.data.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (jobId: number, newStatus: boolean) => {
    try {
      const res = await axiosClient.put<TogglePublishResponse>(
        `/api/job/${jobId}`,
        { is_published: newStatus }
      );

      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, is_published: newStatus } : job
        )
      );
    } catch (err: any) {
      console.error("Toggle publish failed:", err.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return { jobs, loading, error, fetchJobs, togglePublish };
};
