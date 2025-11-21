import React, { useState } from "react";
import ApplicantListTable from "../applicants/ApplicantListTable";
import PreSelectionTestPanel from "../tests/PreselectionTestPanel";
import InterviewScheduler from "../interviews/InterviewScheduler";

interface JobDetailTabsProps {
  jobId: string;
}

const JobDetailTabs: React.FC<JobDetailTabsProps> = ({ jobId }) => {
  const [activeTab, setActiveTab] = useState<
    "applicants" | "tests" | "interview"
  >("applicants");

  const tabs = [
    {
      id: "applicants",
      name: "Pelamar",
      component: <ApplicantListTable jobId={jobId} />,
    },
    {
      id: "tests",
      name: "Pre-selection Test",
      component: <PreSelectionTestPanel jobId={jobId} />,
    },
    {
      id: "interview",
      name: "Jadwal Wawancara",
      component: <InterviewScheduler jobId={jobId} />,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      {/* Header Tab */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition duration-150 ease-in-out ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Konten Tab */}
      <div>{tabs.find((tab) => tab.id === activeTab)?.component}</div>
    </div>
  );
};

export default JobDetailTabs;
