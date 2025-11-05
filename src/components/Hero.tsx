"use client";
import { useEffect, useState } from "react";

type IJob = {
  id: number;
  title: string;
  company: string;
  location: string;
};

export default function Hero() {
  const [jobs, setJobs] = useState<IJob[]>([]);

  useEffect(() => {
    // Contoh data dummy 5 lowongan terbaru
    setJobs([
      {
        id: 1,
        title: "Frontend Developer",
        company: "TechNova",
        location: "Jakarta",
      },
      {
        id: 2,
        title: "Backend Engineer",
        company: "CloudSync",
        location: "Bandung",
      },
      {
        id: 3,
        title: "UI/UX Designer",
        company: "Designify",
        location: "Surabaya",
      },
      {
        id: 4,
        title: "Data Analyst",
        company: "InsightAI",
        location: "Yogyakarta",
      },
      {
        id: 5,
        title: "Mobile Developer",
        company: "AppWorks",
        location: "Remote",
      },
    ]);
  }, []);

  return (
    <section className="w-full bg-gradient-to-br from-blue-600 to-blue-400 text-white py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
          Temukan Karier Impianmu di Job.id
        </h1>
        <p className="text-lg mb-8">
          Platform terbaik untuk pencari kerja dan pemberi kerja di Indonesia.
        </p>

        <div className="bg-white rounded-lg shadow-lg text-gray-800 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">
            Lowongan Terbaru
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-4 border rounded-xl hover:shadow-md transition"
              >
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm">{job.company}</p>
                <p className="text-sm text-gray-500">{job.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
