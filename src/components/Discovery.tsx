"use client";
import { useEffect, useState } from "react";

export default function Discovery() {
  const [location, setLocation] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocation("Jakarta");
          setJobs([
            {
              id: 1,
              title: "Project Manager",
              company: "WorkUp",
              location: "Jakarta",
            },
            {
              id: 2,
              title: "QA Tester",
              company: "Buildify",
              location: "Jakarta",
            },
          ]);
        },
        () => {
          setLocation("Manual");
          setJobs([
            {
              id: 1,
              title: "Marketing Specialist",
              company: "AdWave",
              location: "Bandung",
            },
          ]);
        }
      );
    } else {
      setLocation("Manual");
    }
  }, []);

  return (
    <section id="discovery" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6 text-blue-600">
            Rekomendasi Pekerjaan di Sekitarmu
          </h2>
          <p className="mb-4 text-gray-500">
            Lokasi: {location ? location : "Mendeteksi lokasi..."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-4 bg-white border rounded-xl shadow hover:shadow-md transition"
              >
                <h3 className="font-semibold">{job.title}</h3>
                <p>{job.company}</p>
                <p className="text-gray-500">{job.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
