import React, { useState, useEffect } from "react";
import { Plus, Calendar, Mail, Trash2, Edit } from "lucide-react";

interface Interview {
  id: string;
  applicantName: string;
  dateTime: string; // ISO string
  location: string;
  status: "Scheduled" | "Completed" | "Canceled";
}

interface InterviewSchedulerProps {
  jobId: string;
}

const LOCAL_STORAGE_KEY = "interview_schedules";

const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({ jobId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<Interview[]>([]);
  const [editInterview, setEditInterview] = useState<Interview | null>(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [conflictWarning, setConflictWarning] = useState("");

  const DUMMY_APPLICANTS = ["Budi Santoso", "Rizky Alamsyah", "Fitriani Jaya"];

  // Load dari localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) setSchedules(JSON.parse(stored));
  }, []);

  // Simpan ke localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(schedules));
  }, [schedules]);

  const sendReminder = (interviewId: string, applicantName: string) => {
    alert(
      `Mengirim email pengingat kepada ${applicantName} (ID: ${interviewId})`
    );
  };

  const openCreateModal = () => {
    setEditInterview(null);
    setSelectedDate("");
    setSelectedTime("");
    setConflictWarning("");
    setIsModalOpen(true);
  };

  const openEditModal = (interview: Interview) => {
    setEditInterview(interview);
    const dt = new Date(interview.dateTime);
    setSelectedDate(dt.toISOString().split("T")[0]);
    setSelectedTime(dt.toTimeString().substring(0, 5));
    setConflictWarning("");
    setIsModalOpen(true);
  };

  // Fungsi untuk validasi bentrok ±30 menit
  const hasTimeConflict = (newDateTime: Date, excludeId?: string) => {
    return schedules.some((i) => {
      if (i.id === excludeId || i.status !== "Scheduled") return false;
      const existingTime = new Date(i.dateTime).getTime();
      const newTime = newDateTime.getTime();
      const thirtyMinutes = 30 * 60 * 1000;
      return Math.abs(existingTime - newTime) < thirtyMinutes;
    });
  };

  // Cek bentrok real-time
  useEffect(() => {
    if (!selectedDate || !selectedTime) {
      setConflictWarning("");
      return;
    }
    const dt = new Date(`${selectedDate}T${selectedTime}`);
    if (hasTimeConflict(dt, editInterview?.id)) {
      setConflictWarning(
        "⚠ Jadwal bentrok dengan jadwal lain dalam ±30 menit!"
      );
    } else {
      setConflictWarning("");
    }
  }, [selectedDate, selectedTime, schedules, editInterview]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const applicantName = (
      form.elements.namedItem("applicant") as HTMLSelectElement
    ).value;
    const date = (form.elements.namedItem("date") as HTMLInputElement).value;
    const time = (form.elements.namedItem("time") as HTMLInputElement).value;
    const location = (form.elements.namedItem("location") as HTMLInputElement)
      .value;
    const status = (form.elements.namedItem("status") as HTMLSelectElement)
      .value as Interview["status"];

    if (!applicantName || !date || !time || !location || !status) return;

    const dateTime = new Date(`${date}T${time}`);

    if (hasTimeConflict(dateTime, editInterview?.id)) {
      alert("Jadwal bentrok dengan jadwal lain dalam ±30 menit!");
      return;
    }

    const isoDateTime = dateTime.toISOString();

    if (editInterview) {
      setSchedules((prev) =>
        prev.map((i) =>
          i.id === editInterview.id
            ? { ...i, applicantName, dateTime: isoDateTime, location, status }
            : i
        )
      );
    } else {
      const newInterview: Interview = {
        id: "int" + new Date().getTime(),
        applicantName,
        dateTime: isoDateTime,
        location,
        status,
      };
      setSchedules((prev) => [...prev, newInterview]);
    }

    setIsModalOpen(false);
    setEditInterview(null);
    setSelectedDate("");
    setSelectedTime("");
    setConflictWarning("");
    form.reset();
  };

  const ScheduleModal = () => (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${
        isModalOpen ? "block" : "hidden"
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={() => setIsModalOpen(false)}
        ></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {editInterview
                ? "Edit Jadwal Wawancara"
                : "Buat Jadwal Wawancara Baru"}
            </h3>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pilih Pelamar
                </label>
                <select
                  name="applicant"
                  defaultValue={editInterview?.applicantName || ""}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Pilih Pelamar...</option>
                  {DUMMY_APPLICANTS.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
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
                    name="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
              </div>

              {conflictWarning && (
                <p className="text-red-600 text-sm font-medium">
                  {conflictWarning}
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lokasi/Tautan Meeting
                </label>
                <input
                  type="text"
                  name="location"
                  defaultValue={editInterview?.location || ""}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={editInterview?.status || "Scheduled"}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>

              <div className="pt-3 border-t">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700"
                  disabled={!!conflictWarning}
                >
                  {editInterview
                    ? "Update Jadwal"
                    : "Buat Jadwal & Kirim Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <ScheduleModal />

      <div className="flex justify-between items-center border-b pb-3">
        <h3 className="text-xl font-semibold flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-indigo-600" /> Daftar Jadwal
          Wawancara
        </h3>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Buat Jadwal
        </button>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Belum ada jadwal wawancara untuk job ini.
        </div>
      ) : (
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
              {schedules.map((interview) => (
                <tr key={interview.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {interview.applicantName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(interview.dateTime).toLocaleDateString("id-ID")} -{" "}
                    {new Date(interview.dateTime).toLocaleTimeString("id-ID", {
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
                          : interview.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
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
                        onClick={() => openEditModal(interview)}
                        title="Edit Jadwal"
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        title="Hapus Jadwal"
                        className="text-red-600 hover:text-red-800"
                        onClick={() =>
                          setSchedules((prev) =>
                            prev.filter((i) => i.id !== interview.id)
                          )
                        }
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
      )}
    </div>
  );
};

export default InterviewScheduler;
