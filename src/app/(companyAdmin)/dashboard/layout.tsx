"use client";

import { useState, ReactNode } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // 🔹 Semua Hooks harus di atas
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { loading } = useAuth(["COMPANY_ADMIN"]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // 🔹 Tampilkan loader jika masih loading / validasi
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 1. Sidebar */}
      <Sidebar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />

      {/* Konten Utama */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* 2. Header */}
        <Header />

        {/* 3. Main Content Area */}
        <main
          className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ease-in-out ${
            isCollapsed ? "ml-0" : ""
          }`}
        >
          <div className="bg-white p-6 rounded-lg shadow-md min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
