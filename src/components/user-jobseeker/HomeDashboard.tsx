// components/HomeDashboard.tsx
"use client";

import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import AdContainer from "./AdContainer";
import { useRouter } from "next/navigation";

export default function HomeDashboard() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Utama */}
      <Header router={router} />

      {/* Konten Utama 3 Kolom */}
      <div className="flex mt-8 gap-6">
        {/* Kolom Kiri: Sidebar */}
        <div className="w-1/5 min-w-[200px] hidden lg:block">
          <Sidebar />
        </div>

        {/* Kolom Tengah */}
        <div className="flex-grow lg:w-3/5">
          <MainContent />
        </div>

        {/* Kolom Kanan */}
        <div className="w-1/4 min-w-[280px] hidden xl:block">
          <AdContainer />
        </div>
      </div>
    </div>
  );
}

// --- Header tetap sama tapi tambahkan tombol logout opsional ---
interface HeaderProps {
  router: ReturnType<typeof useRouter>;
}

const Header = ({ router }: HeaderProps) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <div className="bg-white p-4 shadow-sm border-b border-gray-200 flex items-center justify-between">
      <div className="text-xl font-bold text-blue-600">naukri</div>
      <div className="hidden md:flex items-center space-x-6 text-sm text-gray-700">
        <span>Jobs</span>
        <span>Companies</span>
        <span>Services</span>
        <input
          type="text"
          placeholder="Search jobs here"
          className="border rounded-md p-1 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">
          naukri 360
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
