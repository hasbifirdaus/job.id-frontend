"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase } from "lucide-react";

export default function Herop() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (title.trim()) params.append("q", title);
    if (location.trim()) params.append("loc", location);
    if (category.trim()) params.append("cat", category);

    // Arahkan ke halaman /jobs dengan query
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <section
      id="hero"
      className="relative h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/img/hero/hero-woman.jpg")' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/50 flex flex-col justify-center">
        {/* HERO TEXT & FILTER */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center gap-8 px-4 sm:px-8 md:px-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg max-w-4xl leading-tight">
            Temukan Pekerjaan Impian Anda Hari Ini
          </h2>

          {/* Filter Box */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col lg:flex-row flex-wrap gap-4 p-6 bg-white/20 backdrop-blur-md rounded-lg shadow-lg border border-white/30 max-w-6xl w-full justify-center"
          >
            {/* Job Title Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white text-black pl-10 p-3 rounded-md border border-transparent focus:ring-2 focus:ring-blue-600 focus:outline-none"
                placeholder="Judul Pekerjaan, Perusahaan"
              />
            </div>

            {/* Location Input */}
            <div className="relative flex-1 min-w-[220px]">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white text-black pl-10 p-3 rounded-md border border-transparent focus:ring-2 focus:ring-blue-600 focus:outline-none"
                placeholder="Lokasi"
              />
            </div>

            {/* Category Select */}
            <div className="relative min-w-[200px]">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white text-black pl-10 p-3 rounded-md border border-transparent focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="">Bidang Kerja</option>
                <option value="teknologi">Teknologi</option>
                <option value="keuangan">Keuangan</option>
                <option value="pemasaran">Pemasaran</option>
                <option value="desain">Desain</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-blue-700 py-3 px-8 text-white rounded-md hover:bg-blue-800 transition transform hover:scale-[1.02] active:scale-95"
            >
              CARI SEKARANG
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
