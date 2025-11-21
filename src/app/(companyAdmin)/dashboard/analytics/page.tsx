"use client";

import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  Zap,
  Briefcase,
  Filter,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axiosClient from "@/lib/axiosClient";

// ===== TYPES =====
interface TooltipPayload {
  value: number | string;
  name: string;
  dataKey?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
}

interface KpiData {
  conversionRate: string;
  applicantsPerJob: number;
  avgHiringTime: string;
  pageViews: number;
}

interface KpiCardProps {
  title: string;
  value: string;
  trend: "up" | "down";
  icon: React.ElementType;
  trendValue?: string;
}

interface ChartCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

interface ApplicantFlowItem {
  name: string;
  applications: number;
}

interface FunnelItem {
  name: string;
  value: number;
}

interface CategoryItem {
  name: string;
  value: number;
}

interface DemographicsData {
  age: CategoryItem[];
  gender: CategoryItem[];
  location: CategoryItem[];
}

interface SalaryTrendItem {
  position: string;
  avgSalary: number;
}

// COLORS
const PRIMARY_COLOR = "#0D9488";
const SECONDARY_COLOR = "#4F46E5";
const COLORS = [PRIMARY_COLOR, SECONDARY_COLOR, "#FBBF24", "#F87171"];

// ===== UTILS =====
const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    const dataValue = payload[0].value as number | string;
    const isSalary = payload[0].dataKey === "avgSalary";
    return (
      <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-md text-sm">
        <p className="font-semibold text-gray-700">{label}</p>
        <p
          className={`font-bold ${
            isSalary ? "text-indigo-600" : "text-teal-600"
          }`}
        >
          {isSalary
            ? formatRupiah(dataValue as number)
            : (dataValue as number).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

// ===== COMPONENTS =====
const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  trend,
  icon: Icon,
  trendValue = "+15%",
}) => {
  const isUp = trend === "up";
  const trendColor = isUp
    ? "text-emerald-600 bg-emerald-100"
    : "text-red-600 bg-red-100";
  const iconColor = "text-indigo-600";

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg ring-1 ring-gray-50 transition duration-300 hover:ring-indigo-200">
      <div className="flex items-start justify-between">
        <div className="text-sm font-medium text-gray-500">{title}</div>
        {Icon && (
          <div className={`p-2 rounded-full ${iconColor} bg-indigo-50`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <p className="mt-2 text-4xl font-extrabold text-gray-900">{value}</p>
      <div className="mt-3 flex items-center">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${trendColor}`}
        >
          <TrendingUp
            className={`w-3 h-3 mr-1 ${isUp ? "" : "transform rotate-180"}`}
          />
          {trendValue}
        </span>
        <span className="ml-2 text-xs text-gray-500">vs bulan lalu</span>
      </div>
    </div>
  );
};

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  icon: Icon,
  children,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-lg ring-1 ring-gray-50">
    <div className="flex items-start justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {Icon && (
        <div className="p-2 rounded-full bg-teal-50 text-teal-600">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
    <p className="text-sm text-gray-500 mb-6">{description}</p>
    {children}
  </div>
);

// ===== APP COMPONENT =====
const AnalyticsDashboard = () => {
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [applicantFlow, setApplicantFlow] = useState<ApplicantFlowItem[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelItem[]>([]);
  const [topCategories, setTopCategories] = useState<CategoryItem[]>([]);
  const [demographics, setDemographics] = useState<DemographicsData | null>(
    null
  );
  const [salaryTrends, setSalaryTrends] = useState<SalaryTrendItem[]>([]);
  const companyId = 1; // Bisa diganti sesuai company login

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [kpiRes, flowRes, funnelRes, categoryRes, demoRes, salaryRes] =
          await Promise.all([
            axiosClient.get(`/analytics/kpi/${companyId}`),
            axiosClient.get(`/analytics/applicant-flow/${companyId}`),
            axiosClient.get(`/analytics/funnel/${companyId}`),
            axiosClient.get(`/analytics/top-categories/${companyId}`),
            axiosClient.get(`/analytics/demographics/${companyId}`),
            axiosClient.get(`/analytics/salary-trends/${companyId}`),
          ]);

        setKpiData(kpiRes.data as KpiData);
        setApplicantFlow(flowRes.data as ApplicantFlowItem[]);
        setFunnelData(funnelRes.data as FunnelItem[]);
        setTopCategories(categoryRes.data as CategoryItem[]);
        setDemographics(demoRes.data as DemographicsData);
        setSalaryTrends(salaryRes.data as SalaryTrendItem[]);
      } catch (err) {
        console.error("Error fetching analytics", err);
      }
    };

    fetchAnalytics();
  }, [companyId]);

  if (!kpiData || !demographics) return <p>Loading dashboard...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-inter">
      <h1 className="text-3xl font-extrabold text-gray-900 border-b pb-4 mb-8">
        Recruitment Intelligence Dashboard
      </h1>

      {/* KPI CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Tingkat Konversi (Hire)"
          value={kpiData.conversionRate}
          trend="up"
          icon={TrendingUp}
        />
        <KpiCard
          title="Pelamar per Lowongan"
          value={kpiData.applicantsPerJob.toString()}
          trend="up"
          icon={Users}
        />
        <KpiCard
          title="Waktu Rata-rata Hiring"
          value={kpiData.avgHiringTime}
          trend="down"
          icon={Zap}
          trendValue="-5%"
        />
        <KpiCard
          title="Page Views Lowongan"
          value={kpiData.pageViews.toLocaleString()}
          trend="up"
          icon={Briefcase}
        />
      </section>

      {/* Applicant Flow Chart */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard
          title="Tren Jumlah Lamaran"
          description="Aktivitas pelamar dari bulan ke bulan."
          icon={TrendingUp}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={applicantFlow}>
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="applications"
                name="Jumlah Aplikasi"
                stroke={PRIMARY_COLOR}
                strokeWidth={3}
                dot={{ stroke: PRIMARY_COLOR, strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Rata-rata Gaji per Posisi"
          description="Estimasi rata-rata gaji dari data pelamar."
          icon={Zap}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryTrends}>
              <XAxis dataKey="position" stroke="#6B7280" />
              <YAxis
                stroke="#6B7280"
                tickFormatter={(val) => formatRupiah(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="avgSalary"
                name="Rata-rata Gaji"
                fill={SECONDARY_COLOR}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Funnel & Top Categories */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ChartCard
            title="Recruitment Funnel"
            description="Tingkat konversi dari Applied hingga Hired."
            icon={Users}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData} layout="vertical">
                <XAxis type="number" stroke="#6B7280" />
                <YAxis type="category" dataKey="name" stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="value"
                  name="Jumlah Pelamar"
                  fill={PRIMARY_COLOR}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard
          title="Kategori Pekerjaan Paling Diminati"
          description="Distribusi lamaran berdasarkan kategori pekerjaan."
          icon={Briefcase}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topCategories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill={SECONDARY_COLOR}
                label={({ name, percent }) =>
                  `${name} (${((percent || 0) * 100).toFixed(0)}%)`
                }
              >
                {topCategories.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="vertical" verticalAlign="bottom" align="left" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Demographics */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Distribusi Usia Pelamar"
          description="Persentase kelompok usia pelamar."
          icon={Users}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demographics.age}>
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="value"
                name="Jumlah Pelamar"
                fill={SECONDARY_COLOR}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Distribusi Jenis Kelamin"
          description="Perbandingan jumlah pelamar berdasarkan gender."
          icon={Users}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={demographics.gender}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill={PRIMARY_COLOR}
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${((percent || 0) * 100).toFixed(0)}%)`
                }
              >
                {demographics.gender.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="vertical" verticalAlign="bottom" align="left" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Distribusi Lokasi Pelamar"
          description="Jumlah pelamar berdasarkan lokasi prioritas."
          icon={Users}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demographics.location}>
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="value"
                name="Jumlah Pelamar"
                fill={COLORS[2]}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>
    </div>
  );
};

export default AnalyticsDashboard;
