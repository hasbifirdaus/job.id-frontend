"use client";

import React from "react";
import { Search, ListFilter, SortAsc } from "lucide-react";

interface JobFilterBarProps {
  categories?: string[];
  sortOptions?: string[];
  onSearchChange?: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
}

const JobFilterBar: React.FC<JobFilterBarProps> = ({
  categories = [],
  sortOptions = [],
  onSearchChange,
  onCategoryChange,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan Judul Pekerjaan..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      {/* Filter Category */}
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
        <ListFilter className="w-5 h-5 text-gray-500" />
        <select
          className="border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => onCategoryChange?.(e.target.value)}
        >
          {categories.length > 0 ? (
            <>
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </>
          ) : (
            <option disabled>Belum ada kategori</option>
          )}
        </select>
      </div>

      {/* Sorting */}
      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
        <SortAsc className="w-5 h-5 text-gray-500" />
        <select
          className="border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => onSortChange?.(e.target.value)}
        >
          {sortOptions.length > 0 ? (
            <>
              <option value="">Urutkan Berdasarkan...</option>
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </>
          ) : (
            <option disabled>Belum ada opsi</option>
          )}
        </select>
      </div>
    </div>
  );
};

export default JobFilterBar;
