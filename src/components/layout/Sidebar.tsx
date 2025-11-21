import Link from "next/link";
import {
  Briefcase,
  Users,
  Calendar,
  BarChart,
  ChevronLeft,
  ChevronRight,
  Plus,
  // 1. Impor ikon baru untuk Dashboard
  LayoutDashboard,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

// 2. Tambahkan item Dashboard ke array navItems
const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" }, // Item Dashboard
  { name: "Jobs", icon: Briefcase, href: "/dashboard/jobs" },
  { name: "Candidates", icon: Users, href: "/dashboard/candidates" },
  { name: "Interviews", icon: Calendar, href: "/dashboard/interviews" },
  { name: "Analytics", icon: BarChart, href: "/dashboard/analytics" },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleCollapse }) => {
  // Lebar Sidebar menyesuaikan state isCollapsed
  const width = isCollapsed ? "w-20" : "w-64";

  // Label untuk tombol Collapse
  const collapseText = isCollapsed ? "" : "Collapse";
  const CollapseIcon = isCollapsed ? ChevronRight : ChevronLeft;

  return (
    <div
      className={`${width} flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out h-screen p-4 sticky top-0`}
    >
      {/* Tombol Collapse */}
      <button
        onClick={toggleCollapse}
        className={`flex items-center justify-center ${
          isCollapsed ? "w-full" : "w-auto justify-start"
        } p-2 mb-6 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200`}
      >
        <CollapseIcon className="w-5 h-5" />
        <span
          className={`ml-2 transition-opacity duration-200 ${
            isCollapsed ? "opacity-0 hidden" : "opacity-100"
          }`}
        >
          {collapseText}
        </span>
      </button>

      {/* Tombol Create */}
      <Link
        href="/dashboard/jobs/create"
        className={`flex items-center justify-center ${
          isCollapsed ? "w-full" : "w-auto justify-start"
        } p-2 mb-6 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700`}
      >
        <Plus className="w-5 h-5" />
        <span
          className={`ml-2 transition-opacity duration-200 ${
            isCollapsed ? "opacity-0 hidden" : "opacity-100"
          }`}
        >
          Create
        </span>
      </Link>

      {/* Navigasi Utama */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            // Gaya navigasi yang menyesuaikan saat collapse
            className={`flex items-center ${
              isCollapsed ? "justify-center w-full" : "justify-start"
            } p-3 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600`}
            title={item.name}
          >
            <item.icon className="w-5 h-5" />
            <span
              className={`ml-3 whitespace-nowrap transition-opacity duration-200 ${
                isCollapsed ? "opacity-0 hidden" : "opacity-100"
              }`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
