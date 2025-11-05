"use client";
import { useState } from "react";

export default function JobFilter() {
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Mencari pekerjaan: ${filters.title} di ${filters.location}`);
  };

  return (
    <section id="filter" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
            Cari Pekerjaan
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input
              type="text"
              placeholder="Job title..."
              className="border p-3 rounded-lg"
              onChange={(e) =>
                setFilters({ ...filters, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Bidang kerja..."
              className="border p-3 rounded-lg"
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Lokasi..."
              className="border p-3 rounded-lg"
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            />
            <button
              type="submit"
              className="col-span-1 md:col-span-3 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Cari Sekarang
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
