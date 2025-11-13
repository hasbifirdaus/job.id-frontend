"use client";

import React from "react";
import ChartCard from "@/components/analytics/ChartCard";
import { TrendingUp, Users, Zap, Briefcase, Filter } from "lucide-react";

// Data dummy yang akan digunakan untuk mengisi grafik recharts (jika diimplementasikan)
const APPLICANT_FLOW_DATA = [
  { name: "Jan", applications: 400 },
  { name: "Feb", applications: 300 },
  { name: "Mar", applications: 500 },
  { name: "Apr", applications: 600 },
  { name: "May", applications: 450 },
];

const FUNNEL_DATA = [
  { name: "Applied", value: 1200 },
  { name: "Processed", value: 850 },
  { name: "Test Passed", value: 420 },
  { name: "Interviewed", value: 150 },
  { name: "Hired", value: 30 },
];

const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Website & Recruitment Analytics
      </h1>

      {/* Pilihan Filter Waktu */}
      <div className="flex items-center space-x-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <select className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
          <option value="30d">30 Hari Terakhir</option>
          <option value="90d">90 Hari Terakhir</option>
          <option value="ytd">Tahun Ini</option>
        </select>
        <select className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
          <option value="">Semua Lowongan</option>
          <option value="frontend">Frontend Developer</option>
          <option value="hr">HR Specialist</option>
        </select>
      </div>

      {/* Bagian 1: Metrik Kunci (KPI Cards) */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title="Tingkat Konversi (Hire)" value="2.5%" trend="up" />
        <KpiCard title="Pelamar per Lowongan" value="34" trend="up" />
        <KpiCard title="Waktu Rata-rata Hiring" value="28 hari" trend="down" />
        <KpiCard title="Page Views Lowongan" value="18,345" trend="up" />
      </section>

      {/* Bagian 2: Visualisasi Utama (Line, Bar) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafik 1: Applicant Flow (Tren Lamaran) */}
        <ChartCard
          title="Tren Jumlah Lamaran"
          description="Aktivitas pelamar dari bulan ke bulan."
          icon={TrendingUp}
        >
          {/* Placeholder/Stub: Anda akan mengganti ini dengan <LineChart> dari Recharts */}
          <div className="bg-gray-100 w-full h-full rounded-lg flex items-center justify-center text-sm text-gray-500">
            [Placeholder Grafik Garis (Applicant Flow)]
          </div>
        </ChartCard>

        {/* Grafik 2: Conversion Rate by Source (Sumber Konversi) */}
        <ChartCard
          title="Tingkat Konversi Berdasarkan Sumber"
          description="Efektivitas sumber traffic (LinkedIn, Job Portal, Referral)."
          icon={Zap}
        >
          {/* Placeholder/Stub: Anda akan mengganti ini dengan <BarChart> dari Recharts */}
          <div className="bg-gray-100 w-full h-full rounded-lg flex items-center justify-center text-sm text-gray-500">
            [Placeholder Grafik Batang (Konversi Sumber)]
          </div>
        </ChartCard>
      </section>

      {/* Bagian 3: Funnel dan Distribusi */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik 3: Hiring Funnel */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Recruitment Funnel"
            description="Visualisasi Corong dari Applied hingga Hired."
            icon={Users}
          >
            {/* Placeholder/Stub: Anda akan mengganti ini dengan <FunnelChart> atau sejenisnya */}
            <div className="bg-gray-100 w-full h-full rounded-lg flex items-center justify-center text-sm text-gray-500">
              [Placeholder Grafik Funnel (Corong Rekrutmen)]
            </div>
          </ChartCard>
        </div>

        {/* Grafik 4: Top Categories (Kategori Populer) */}
        <div>
          <ChartCard
            title="Kategori Pekerjaan Paling Diminati"
            description="Distribusi lamaran berdasarkan kategori pekerjaan."
            icon={Briefcase}
          >
            {/* Placeholder/Stub: Anda akan mengganti ini dengan <PieChart> atau <DoughnutChart> */}
            <div className="bg-gray-100 w-full h-full rounded-lg flex items-center justify-center text-sm text-gray-500">
              [Placeholder Grafik Lingkaran (Kategori)]
            </div>
          </ChartCard>
        </div>
      </section>
    </div>
  );
};

// Komponen Sederhana untuk Kartu KPI
const KpiCard: React.FC<{
  title: string;
  value: string;
  trend: "up" | "down";
}> = ({ title, value, trend }) => (
  <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-100">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <div className="flex items-center justify-between mt-1">
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <div
        className={`flex items-center text-sm font-semibold ${
          trend === "up" ? "text-green-500" : "text-red-500"
        }`}
      >
        {trend === "up" ? (
          <TrendingUp className="w-4 h-4 mr-1" />
        ) : (
          <TrendingUp className="w-4 h-4 mr-1 transform rotate-180" />
        )}
        +15%
      </div>
    </div>
  </div>
);

export default AnalyticsPage;
