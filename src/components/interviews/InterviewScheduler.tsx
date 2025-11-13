import React, { useState } from "react";
import { Plus, Calendar, Mail, Trash2, Edit } from "lucide-react";

interface Interview {
  id: string;
  applicantName: string;
  dateTime: Date;
  location: string;
  status: "Scheduled" | "Completed" | "Canceled";
}

interface InterviewSchedulerProps {
  jobId: string;
}

// Data dummy untuk jadwal wawancara
const DUMMY_SCHEDULES: Interview[] = [
  {
    id: "int001",
    applicantName: "Budi Santoso",
    dateTime: new Date("2025-11-20T10:00:00"),
    location: "Zoom Meeting",
    status: "Scheduled",
  },
  {
    id: "int002",
    applicantName: "Rizky Alamsyah",
    dateTime: new Date("2025-11-21T14:30:00"),
    location: "Kantor Pusat",
    status: "Scheduled",
  },
  {
    id: "int003",
    applicantName: "Sarah Lestari",
    dateTime: new Date("2025-11-05T09:00:00"),
    location: "Google Meet",
    status: "Completed",
  },
];

const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({ jobId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dalam proyek nyata, Anda akan memiliki daftar pelamar yang 'Processed' atau 'Interviewed'
  const DUMMY_APPLICANTS = ["Budi Santoso", "Rizky Alamsyah", "Fitriani Jaya"];

  // Fungsi untuk mengirim email pengingat (Schedule Reminder)
  const sendReminder = (interviewId: string, applicantName: string) => {
    alert(
      `Mengirim email pengingat kepada ${applicantName} (ID: ${interviewId})`
    );
    // Implementasi API call untuk mengirim email H-1
  };

  // === Komponen Modal: Form Pembuatan Jadwal (Create Schedule) ===
  const ScheduleCreationModal = () => (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${
        isModalOpen ? "block" : "hidden"
      }`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background Overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={() => setIsModalOpen(false)}
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal Panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3
              className="text-lg leading-6 font-medium text-gray-900"
              id="modal-title"
            >
              Buat Jadwal Wawancara Baru
            </h3>
            <form className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pilih Pelamar
                </label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="">
                    Pilih Pelamar yang akan diwawancara...
                  </option>
                  {DUMMY_APPLICANTS.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Pelamar akan menerima notifikasi jadwal via email.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Waktu
                  </label>
                  <input
                    type="time"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lokasi/Tautan Meeting
                </label>
                <input
                  type="text"
                  placeholder="Zoom Link / Alamat Kantor"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div className="pt-3 border-t">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700"
                >
                  Buat Jadwal & Kirim Email
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
  // End Modal

  return (
    <div className="space-y-6">
      <ScheduleCreationModal />

      <div className="flex justify-between items-center border-b pb-3">
        <h3 className="text-xl font-semibold flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-indigo-600" /> Daftar Jadwal
          Wawancara
        </h3>
        {/* Tombol Create Schedule */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Buat Jadwal
        </button>
      </div>

      {/* Tabel Jadwal */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Pelamar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tanggal & Waktu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Lokasi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {DUMMY_SCHEDULES.map((interview) => (
              <tr key={interview.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {interview.applicantName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {interview.dateTime.toLocaleDateString("id-ID")} -{" "}
                  {interview.dateTime.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {interview.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      interview.status === "Scheduled"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {interview.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex space-x-2 justify-center">
                    {interview.status === "Scheduled" && (
                      <button
                        onClick={() =>
                          sendReminder(interview.id, interview.applicantName)
                        }
                        title="Kirim Email Pengingat (H-1)"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Mail className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      title="Edit Jadwal"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      title="Hapus Jadwal"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InterviewScheduler;
