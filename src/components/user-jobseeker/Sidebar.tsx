// components/Sidebar.tsx

const Sidebar = () => {
  return (
    <div className="space-y-6">
      {/* Bagian Profil Singkat */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-gray-200">{/*  */}</div>
          <div>
            <p className="font-semibold text-gray-800">Hasbi Firdaus Fauzun</p>
            <p className="text-sm text-blue-600 cursor-pointer hover:underline">
              Complete profile
            </p>
          </div>
        </div>

        {/* Status Missing */}
        <div className="mt-4 pt-4 border-t border-dashed border-gray-200 text-sm">
          <p className="font-medium text-red-500 mb-2">What are you missing?</p>
          <ul className="space-y-1 text-gray-600">
            <li className="flex items-center space-x-2">
              <span className="text-red-500">⚫</span>
              <span>Job application updates</span>
            </li>
            {/* ... item missing lainnya */}
          </ul>
        </div>
      </div>

      {/* Navigasi Link */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <nav className="space-y-3 text-sm">
          <SidebarLink icon="🏠" label="My home" active />
          <SidebarLink icon="💼" label="Jobs" />
          <SidebarLink icon="🏢" label="Companies" />
          <SidebarLink icon="✍️" label="Blogs" />
          <SidebarLink icon="⚙️" label="How Naukri works?" />
        </nav>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  icon: string;
  label: string;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, active }) => (
  <a
    href="#"
    className={`flex items-center space-x-2 p-2 rounded-md transition duration-150 ${
      active
        ? "bg-blue-50 text-blue-700 font-semibold"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </a>
);

export default Sidebar;
