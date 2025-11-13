import React, { ReactNode } from "react";
import { TrendingUp, Users, Zap, Briefcase } from "lucide-react";

interface ChartCardProps {
  title: string;
  description: string;
  children: ReactNode;
  icon: React.ElementType; // Menggunakan React.ElementType untuk komponen Lucide
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  children,
  icon: Icon,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center space-x-3 mb-4 border-b pb-3">
        <Icon className="w-6 h-6 text-indigo-600" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      {/* Area Grafik */}
      <div className="flex-1 min-h-[250px] flex items-center justify-center">
        {/* Placeholder untuk Recharts/Chart.js */}
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
