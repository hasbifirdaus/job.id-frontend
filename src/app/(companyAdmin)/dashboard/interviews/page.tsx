"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  Clock,
} from "lucide-react";
import axios from "axios";

interface User {
  name: string;
  email: string;
  profile_image_url?: string;
}

interface Job {
  title: string;
  company_id: number;
}

interface Application {
  id: number;
  user: User;
  job: Job;
}

interface Interview {
  id: number;
  schedule_date: string;
  interview_type: "ONLINE" | "OFFLINE" | "HYBRID";
  location?: string;
  meeting_link?: string;
  status: string;
  application: Application;
}

interface InterviewEvent {
  id: string;
  applicantName: string;
  jobTitle: string;
  dateTime: Date;
  location?: string;
  meeting_link?: string;
  status: string;
}
interface GetInterviewsResponse {
  success: boolean;
  data: Interview[];
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<InterviewEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const token = localStorage.getItem("token"); // COMPANY_ADMIN token

  // --- Fetch Interviews dari API ---
  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true);
      try {
        const res = await axios.get<GetInterviewsResponse>(
          "http://localhost:8000/api/interview",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          const events: InterviewEvent[] = res.data.data.map(
            (i: Interview) => ({
              id: String(i.id),
              applicantName: i.application.user.name,
              jobTitle: i.application.job.title,
              dateTime: new Date(i.schedule_date),
              location: i.location ?? "",
              meeting_link: i.meeting_link ?? "",
              status: i.status,
            })
          );
          setInterviews(events);
        } else {
          setError("Gagal memuat data wawancara");
        }
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [token]);

  // --- Kalender Dasar ---
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const numDaysInMonth = endOfMonth.getDate();
  const startDay = startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1;

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push({ date: null, isCurrentMonth: false });
    }
    for (let i = 1; i <= numDaysInMonth; i++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        isCurrentMonth: true,
      });
    }
    const remainingSlots = 42 - days.length;
    for (let i = 0; i < remainingSlots; i++) {
      days.push({ date: null, isCurrentMonth: false });
    }
    return days;
  }, [currentDate, startDay, numDaysInMonth]);

  const getEventsForDate = (date: Date) =>
    interviews.filter(
      (event) => event.dateTime.toDateString() === date.toDateString()
    );

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const currentMonthName = currentDate.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
  const today = new Date();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <CalendarIcon className="w-7 h-7 mr-3 text-indigo-600" /> Semua Jadwal
          Wawancara
        </h1>
        {/* <button
          onClick={() =>
            alert("Membuka modal untuk membuat jadwal wawancara baru")
          }
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-indigo-700 flex items-center transition duration-150"
        >
          <Plus className="w-4 h-4 mr-2" /> Jadwal Baru
        </button> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Kalender */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {currentMonthName}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={goToPreviousMonth}
                className="p-2 border rounded-full hover:bg-gray-100 text-gray-600"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 border rounded-full hover:bg-gray-100 text-gray-600"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 border-b pb-2 mb-2">
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 h-auto">
            {calendarDays.map((day, index) => {
              const events = day.date ? getEventsForDate(day.date) : [];
              const isToday =
                day.date && day.date.toDateString() === today.toDateString();

              return (
                <div
                  key={index}
                  className={`relative p-2 min-h-[100px] border rounded-lg transition duration-100 
                    ${
                      day.isCurrentMonth
                        ? "bg-white hover:bg-indigo-50"
                        : "bg-gray-50 text-gray-400"
                    }
                    ${
                      isToday
                        ? "border-2 border-indigo-500 ring-2 ring-indigo-200"
                        : "border-gray-200"
                    }
                  `}
                >
                  <span
                    className={`text-sm font-semibold ${
                      isToday ? "text-indigo-600" : "text-gray-900"
                    }`}
                  >
                    {day.date ? day.date.getDate() : ""}
                  </span>

                  <div className="mt-1 space-y-1">
                    {events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        title={`${event.applicantName} (${event.jobTitle})`}
                        className="truncate text-xs px-1 py-0.5 bg-indigo-100 text-indigo-800 rounded cursor-pointer hover:bg-indigo-200"
                      >
                        <Clock className="inline w-3 h-3 mr-1" />
                        {event.dateTime.toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-xs text-center text-gray-600 pt-1">
                        +{events.length - 2} lagi
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Jadwal Terdekat */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">
              Jadwal Terdekat
            </h3>

            {interviews
              .filter((e) => e.dateTime >= today)
              .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
              .slice(0, 5)
              .map((event) => (
                <div
                  key={event.id}
                  className="py-3 border-b last:border-b-0 hover:bg-gray-50 -mx-4 px-4 transition duration-100"
                >
                  <p className="text-sm font-semibold text-gray-900 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-indigo-500" />
                    {event.applicantName}
                  </p>
                  <p className="text-xs text-gray-600 ml-6">{event.jobTitle}</p>
                  <p className="text-xs text-gray-500 ml-6 mt-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {event.dateTime.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    pada{" "}
                    {event.dateTime.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}

            {interviews.filter((e) => e.dateTime >= today).length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Tidak ada jadwal wawancara terdekat.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
