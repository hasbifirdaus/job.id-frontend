// src/components/jobs/JobFilterBar.tsx

import React from "react";
import { Search, ListFilter, SortAsc } from "lucide-react";

const JobFilterBar: React.FC = () => {
  // Data dummy untuk dropdown (dalam proyek nyata, ini diambil dari API atau state)
  const categories = ["Technology", "HR", "Marketing", "Finance"];
  const sortOptions = ["Newest", "Oldest", "Most Applicants"];

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      {/* Search Input (Filtering by Title) */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan Judul Pekerjaan..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Filter Category */}
      <div className="flex items-center space-x-2">
        <ListFilter className="w-5 h-5 text-gray-500" />
        <select className="border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500">
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Sorting */}
      <div className="flex items-center space-x-2">
        <SortAsc className="w-5 h-5 text-gray-500" />
        <select className="border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500">
          <option value="">Urutkan Berdasarkan...</option>
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default JobFilterBar;
