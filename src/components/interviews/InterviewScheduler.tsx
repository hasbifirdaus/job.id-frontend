import React, { useState, useEffect } from "react";
import { Plus, Calendar, Mail, Trash2, Edit } from "lucide-react";
import axiosClient from "@/lib/axiosClient";

interface BackendInterview {
  id: number;
  application_id: number;
  schedule_date: string;
  interview_type: string;
  meeting_link?: string | null;
  location?: string | null;
  notes?: string | null;
  application: {
    id: number;
    user: { id?: number; name: string; email?: string };
    job: { id: number; title: string; company_id?: number };
  };
}

interface ApplicantItem {
  id: number;
  user: { name: string };
}

interface InterviewSchedulerProps {
  jobId: string;
}

interface ApplicantsResponse {
  applicants: ApplicantItem[];
}

interface GetInterviewResponse {
  success: boolean;
  data: BackendInterview[];
}

const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({ jobId }) => {
  const [schedules, setSchedules] = useState<BackendInterview[]>([]);
  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editInterview, setEditInterview] = useState<BackendInterview | null>(
    null
  );

  // form values
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [interviewType, setInterviewType] = useState("OFFLINE");
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [conflictWarning, setConflictWarning] = useState("");

  // ================================
  // FETCH INTERVIEWS
  // ================================
  const fetchSchedules = async () => {
    try {
      setLoading(true);

      const res = await axiosClient.get<GetInterviewResponse>("/interview");

      // Pastikan mengambil array-nya
      const data = res.data?.data ?? [];

      const jobNum = Number(jobId);
      const filtered = data.filter(
        (i: BackendInterview) => i.application?.job?.id === jobNum
      );

      setSchedules(filtered);
    } catch (err) {
      console.error(err);
      alert("Gagal memuat jadwal!");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // FETCH APPLICANTS FOR DROPDOWN
  // ================================
  const fetchApplicants = async () => {
    try {
      const res = await axiosClient.get<ApplicantsResponse>(
        `/applicantmanagement/company/jobs/${jobId}/applicants`
      );

      if (Array.isArray(res.data.applicants)) {
        setApplicants(res.data.applicants);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memuat data pelamar.");
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchApplicants();
  }, [jobId]);

  // ================================
  // CONFLICT CHECK
  // ================================
  const hasTimeConflict = (newDT: Date, excludeId?: number) => {
    return schedules.some((i) => {
      if (i.id === excludeId) return false;
      const diff = Math.abs(
        new Date(i.schedule_date).getTime() - newDT.getTime()
      );
      return diff < 30 * 60000; // 30 minutes
    });
  };

  useEffect(() => {
    if (!selectedDate || !selectedTime) return;
    const dt = new Date(`${selectedDate}T${selectedTime}`);
    if (hasTimeConflict(dt, editInterview?.id)) {
      setConflictWarning("⚠ Jadwal bentrok dengan jadwal lain dalam 30 menit!");
    } else {
      setConflictWarning("");
    }
  }, [selectedDate, selectedTime, schedules, editInterview]);

  // ================================
  // OPEN MODAL CREATE
  // ================================
  const openCreateModal = () => {
    setEditInterview(null);
    setSelectedDate("");
    setSelectedTime("");
    setInterviewType("OFFLINE");
    setLocation("");
    setMeetingLink("");
    setApplicationId(null);
    setIsModalOpen(true);
  };

  // ================================
  // OPEN MODAL EDIT
  // ================================
  const openEditModal = (i: BackendInterview) => {
    setEditInterview(i);

    const d = new Date(i.schedule_date);
    setSelectedDate(d.toISOString().split("T")[0]);
    setSelectedTime(d.toTimeString().slice(0, 5));
    setInterviewType(i.interview_type);
    setLocation(i.location || "");
    setMeetingLink(i.meeting_link || "");
    setApplicationId(i.application_id);

    setIsModalOpen(true);
  };

  // ================================
  // SUBMIT (CREATE & UPDATE)
  // ================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dt = new Date(`${selectedDate}T${selectedTime}`);
    if (hasTimeConflict(dt, editInterview?.id)) {
      alert("Jadwal bentrok!");
      return;
    }

    // VALIDATION
    if (!applicationId) {
      alert("Pilih pelamar terlebih dahulu!");
      return;
    }

    const payload = {
      application_id: applicationId,
      schedule_date: dt.toISOString(),
      interview_type: interviewType,
      meeting_link: meetingLink || undefined,
      location: location || undefined,
    };

    try {
      if (editInterview) {
        await axiosClient.put(`/interview/${editInterview.id}`, payload);
      } else {
        await axiosClient.post("/interview", payload);
      }

      await fetchSchedules();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal menyimpan jadwal");
    }
  };

  // ================================
  // DELETE
  // ================================
  const handleDelete = async (id: number) => {
    if (!confirm("Hapus jadwal wawancara ini?")) return;
    try {
      await axiosClient.delete(`/interview/${id}`);
      fetchSchedules();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus!");
    }
  };

  // ================================
  // REMINDER
  // ================================
  const sendReminder = async (id: number, name: string) => {
    if (!confirm(`Kirim reminder ke ${name}?`)) return;

    try {
      const res = await axiosClient.post(`/interview/${id}/send-reminder`);

      alert("Reminder berhasil dikirim!");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Gagal mengirim reminder");
    }
  };

  return (
    <div className="space-y-6">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4"
          >
            <h2 className="text-lg font-semibold">
              {editInterview ? "Edit Jadwal" : "Buat Jadwal"}
            </h2>

            {/* Applicant dropdown */}
            {!editInterview && (
              <div>
                <label className="block mb-1">Pilih Pelamar</label>
                <select
                  className="w-full border p-2"
                  value={applicationId ?? ""}
                  onChange={(e) =>
                    setApplicationId(Number(e.target.value) || null)
                  }
                  required
                >
                  <option value="">-- pilih pelamar --</option>
                  {applicants.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.user.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label>Tanggal</label>
              <input
                type="date"
                className="w-full border p-2"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Waktu</label>
              <input
                type="time"
                className="w-full border p-2"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
              />
            </div>

            {conflictWarning && (
              <p className="text-red-500 text-sm">{conflictWarning}</p>
            )}

            <div>
              <label>Jenis Interview</label>
              <select
                className="w-full border p-2"
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
              >
                <option value="ONLINE">ONLINE</option>
                <option value="OFFLINE">OFFLINE</option>
                <option value="HYBRID">HYBRID</option>
              </select>
            </div>

            {interviewType !== "OFFLINE" && (
              <div>
                <label>Meeting Link</label>
                <input
                  className="w-full border p-2"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                />
              </div>
            )}

            {interviewType !== "ONLINE" && (
              <div>
                <label>Lokasi</label>
                <input
                  className="w-full border p-2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            )}

            <button
              type="submit"
              className="bg-indigo-600 text-white w-full py-2 rounded"
            >
              Simpan
            </button>

            <button
              type="button"
              className="text-gray-600 w-full py-2"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </button>
          </form>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" /> Jadwal Wawancara
        </h3>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded bg-indigo-600 text-white"
        >
          <Plus className="w-4 h-4 inline mr-1" />
          Buat
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : schedules.length === 0 ? (
        <p className="text-gray-500">Belum ada jadwal.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Pelamar</th>
              <th className="p-2 text-left">Tanggal</th>
              <th className="p-2 text-left">Tipe</th>
              <th className="p-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((i) => (
              <tr key={i.id} className="border-b">
                <td className="p-2">{i.application.user.name}</td>
                <td className="p-2">
                  {new Date(i.schedule_date).toLocaleString("id-ID")}
                </td>
                <td className="p-2">{i.interview_type}</td>
                <td className="p-2 flex gap-3 justify-center">
                  <button
                    onClick={() => sendReminder(i.id, i.application.user.name)}
                    className="text-blue-600"
                  >
                    <Mail />
                  </button>

                  <button
                    onClick={() => openEditModal(i)}
                    className="text-gray-600"
                  >
                    <Edit />
                  </button>

                  <button
                    onClick={() => handleDelete(i.id)}
                    className="text-red-600"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InterviewScheduler;
