"use client";

import React from "react";
import {
  Briefcase,
  Users,
  Calendar,
  BarChart3,
  Clock,
  TrendingUp,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
}) => (
  <div className="p-5 bg-white rounded-lg shadow-md flex flex-col justify-between border border-gray-100 min-h-[140px]">
    <div>
      <div className="flex items-center space-x-2">
        <Icon className="w-5 h-5 text-indigo-600" />
        <p className="text-sm font-medium text-gray-500">{title}</p>
      </div>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
    <p className="text-xs text-gray-400 mt-2">{description}</p>
  </div>
);

// --- Komponen Daftar Aksi Cepat (Simulasi) ---

const RecentActivityList: React.FC = () => {
  // Data Dummy Aksi Terbaru
  const recentActions = [
    {
      type: "interview",
      description: "Wawancara Budi Santoso (Senior Dev) selesai.",
      time: "1 jam lalu",
      color: "bg-purple-100 text-purple-800",
      icon: Calendar,
    },
    {
      type: "applicant",
      description: "Sarah Lestari mengajukan lamaran baru (Marketing).",
      time: "3 jam lalu",
      color: "bg-blue-100 text-blue-800",
      icon: Users,
    },
    {
      type: "job",
      description: 'Lowongan "Data Scientist" akan ditutup besok.',
      time: "5 jam lalu",
      color: "bg-red-100 text-red-800",
      icon: Briefcase,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">
        Aktivitas Terbaru
      </h2>
      <ul className="space-y-3">
        {recentActions.map((action, index) => (
          <li key={index} className="flex items-start space-x-3">
            <div className={`p-2 rounded-full ${action.color}`}>
              <action.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">{action.description}</p>
              <p className="text-xs text-gray-500">{action.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Komponen Tren (Simulasi) ---
const ApplicantTrendChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-full">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
        Tren Lamaran (30 Hari)
      </h2>
      {/* Placeholder untuk Grafik Garis */}
      <div className="bg-gray-50 w-full h-64 rounded-lg flex items-center justify-center text-sm text-gray-500">
        [Placeholder Grafik Line dari Recharts]
      </div>
      <p className="text-sm text-center text-gray-500 mt-4">
        Total 1,890 lamaran bulan ini.
      </p>
    </div>
  );
};

// --- Komponen DashboardPage Utama ---

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Selamat Datang di Admin Dashboard!
      </h1>

      {/* Bagian 1: Metrik Utama (KPIs) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Lowongan Aktif"
          value="18"
          icon={Briefcase}
          description="Lihat semua lowongan yang sedang dibuka."
        />
        <StatCard
          title="Pelamar Baru (7 Hari)"
          value="456"
          icon={Users}
          description="Peningkatan 12% dari minggu lalu."
        />
        <StatCard
          title="Wawancara Mendatang"
          value="5 Jadwal"
          icon={Calendar}
          description="Jadwal tersisa untuk 7 hari ke depan."
        />
        <StatCard
          title="Tingkat Konversi"
          value="3.2%"
          icon={TrendingUp}
          description="Applied to Hired Rate secara keseluruhan."
        />
      </section>

      {/* Bagian 2: Tren dan Aktivitas Cepat */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Tren Grafik */}
        <div className="lg:col-span-2">
          <ApplicantTrendChart />
        </div>

        {/* Kolom Kanan: Aktivitas Terbaru */}
        <div>
          <RecentActivityList />
        </div>
      </section>

      {/* Bagian 3: Status Pekerjaan Penting (Opsional) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Status Pekerjaan Prioritas
        </h2>
        {/* Placeholder untuk daftar ringkas lowongan yang memerlukan aksi, misalnya, yang memiliki banyak pelamar baru */}
        <div className="bg-white p-4 rounded-lg border border-gray-100 text-gray-500">
          [Daftar ringkas (Job, Jumlah Pelamar Baru) dengan link ke detail
          lowongan]
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
