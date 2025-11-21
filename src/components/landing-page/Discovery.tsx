"use client";
import React, { useEffect, useState, useRef } from "react";
import { MapPin, Building, ArrowRight, ArrowLeft } from "lucide-react";

// ==== Interface ====
interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
}

// ==== Komponen JobCard ====
const JobCard = ({ job }: { job: Job }) => (
  <div className="h-full p-6 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-blue-500/30 transition duration-300 cursor-pointer flex flex-col justify-between">
    {/* Header */}
    <div className="flex items-start gap-4 mb-4">
      <img
        src="/img/logo/logo-company-default.jpg"
        alt={`${job.company} logo`}
        className="w-12 h-12 object-cover rounded-lg border p-1 flex-shrink-0"
        onError={(e) =>
          (e.currentTarget.src =
            "https://placehold.co/48x48/dddddd/333333?text=Logo")
        }
      />
      <div>
        <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">
          {job.title}
        </h3>
        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
          <Building size={14} /> {job.company}
        </p>
      </div>
    </div>

    {/* Footer */}
    <div className="flex justify-between items-end mt-auto pt-2">
      <p className="flex items-center gap-2 text-sm text-gray-500 font-medium">
        <MapPin size={16} className="text-blue-500" /> {job.location}
      </p>
      <span
        className={`text-xs font-semibold px-3 py-1 rounded-full ${
          job.type === "Full-Time"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {job.type}
      </span>
    </div>
  </div>
);

// ==== Komponen Tombol Arah (reusable) ====
const ArrowButton = ({
  direction,
  visible,
  onClick,
  isNearby, // Properti untuk membedakan warna tombol jika diperlukan
}: {
  direction: "left" | "right";
  visible: boolean;
  onClick: () => void;
  isNearby?: boolean;
}) => {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight;
  const position = direction === "left" ? "left-2" : "right-2";
  const iconColor = isNearby ? "text-gray-600" : "text-blue-600";

  return (
    <button
      onClick={onClick}
      className={`absolute ${position} top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full shadow-lg z-10 transition ${
        visible ? "bg-white hover:bg-gray-100" : "opacity-0 pointer-events-none"
      } hidden sm:block`}
    >
      <Icon size={22} className={iconColor} />
    </button>
  );
};

// ==== Komponen Carousel Reusable ====
const JobCarousel = ({
  title,
  subtitle,
  jobs,
  link,
  isNearby = false, // Properti baru untuk kustomisasi khusus
}: {
  title: string;
  subtitle: string | React.ReactNode;
  jobs: Job[];
  link: string;
  isNearby?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  // Update status tombol panah
  const updateScrollState = () => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    const maxScroll = scrollWidth - clientWidth;

    // Memberikan toleransi kecil pada batas
    setCanScroll({
      left: scrollLeft > 10,
      right: scrollLeft < maxScroll - 10,
    });
  };

  const scroll = (dir: "left" | "right") =>
    ref.current?.scrollBy({
      // Jarak scroll disesuaikan untuk 1 kartu + gap (~340px)
      left: dir === "left" ? -340 : 340,
      behavior: "smooth",
    });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Panggil sekali untuk inisialisasi state
    updateScrollState();

    // Event listeners
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    // Cleanup
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [jobs]); // Rerun effect jika data pekerjaan berubah

  // Teks CTA yang dinamis
  const ctaText = isNearby
    ? "Lihat semua pekerjaan yang ada di sekitarmu"
    : `Lihat Semua Lowongan (${jobs.length} tersedia)`;

  const ctaColor = isNearby
    ? "text-gray-600 hover:text-gray-800"
    : "text-blue-600 hover:text-blue-800";

  return (
    <div className="relative text-center">
      {/* Heading */}
      <h2
        className={`text-4xl font-extrabold mb-4 ${
          isNearby ? "text-gray-800" : "text-blue-700"
        }`}
      >
        {title}
      </h2>
      <p className="mb-10 text-gray-500 text-lg">{subtitle}</p>

      {/* Carousel */}
      <div className="relative">
        <ArrowButton
          direction="left"
          visible={canScroll.left}
          onClick={() => scroll("left")}
          isNearby={isNearby}
        />
        <div
          ref={ref}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide px-2 md:px-0"
        >
          {jobs.length ? (
            jobs.map((job) => (
              <div
                key={job.id}
                // Lebar kartu 90% di mobile, 48% di tablet, 320px di desktop
                className="min-w-[90%] sm:min-w-[48%] lg:min-w-[320px] snap-start"
              >
                <JobCard job={job} />
              </div>
            ))
          ) : (
            <p className="min-w-full text-center text-gray-500 p-8 border-dashed border-2 rounded-lg">
              Tidak ada lowongan yang tersedia saat ini.
            </p>
          )}
        </div>
        <ArrowButton
          direction="right"
          visible={canScroll.right}
          onClick={() => scroll("right")}
          isNearby={isNearby}
        />
      </div>

      {/* CTA */}
      <a
        href={link}
        className={`inline-flex items-center mt-10 ${ctaColor} font-semibold transition group text-lg`}
      >
        {ctaText}
        <ArrowRight
          size={20}
          className="ml-2 group-hover:translate-x-1 transition"
        />
      </a>
    </div>
  );
};

// ==== Komponen Utama ====
export default function Discovery() {
  const [location, setLocation] = useState("Memeriksa lokasi...");
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [nearbyJobs, setNearbyJobs] = useState<Job[]>([]);

  const dummyJobs: Job[] = [
    {
      id: 1,
      title: "UI/UX Designer",
      company: "Creative Minds",
      location: "Remote",
      type: "Full-Time",
    },
    {
      id: 2,
      title: "Frontend Dev",
      company: "TechForge",
      location: "Jakarta",
      type: "Full-Time",
    },
    {
      id: 3,
      title: "Marketing Specialist",
      company: "PromoPlus",
      location: "Bandung",
      type: "Contract",
    },
    {
      id: 4,
      title: "Project Manager",
      company: "Innovate",
      location: "Surabaya",
      type: "Full-Time",
    },
    {
      id: 5,
      title: "Full-Stack Engineer",
      company: "Digital Core",
      location: "Remote",
      type: "Full-Time",
    },
    {
      id: 6,
      title: "Data Analyst",
      company: "Insight Co.",
      location: "Jakarta",
      type: "Full-Time",
    },
    {
      id: 7,
      title: "Sales Executive",
      company: "Global Sales",
      location: "Surabaya",
      type: "Full-Time",
    },
  ];

  useEffect(() => {
    setLatestJobs(dummyJobs);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Asumsi lokasi terdekat adalah Jakarta untuk demo
          setLocation("Jakarta");
          setNearbyJobs(dummyJobs.slice(0, 4));
        },
        () => {
          setLocation("Lokasi tidak terdeteksi");
          setNearbyJobs(dummyJobs.slice(0, 3));
        }
      );
    } else {
      setLocation("Geolocation tidak didukung");
      setNearbyJobs(dummyJobs.slice(0, 3));
    }
  }, []);

  // Logika Subtitle untuk Pekerjaan di Sekitarmu
  const nearbySubtitle =
    location.includes("tidak") || location.includes("Geolocation") ? (
      "Aktifkan lokasi untuk menampilkan lowongan di sekitarmu."
    ) : (
      <span>
        Pekerjaan direkomendasikan di dekat{" "}
        <span className="font-bold text-blue-600">{location}</span>.
      </span>
    );

  return (
    <section id="discovery" className="py-20 bg-gray-50">
      <style jsx global>{`
        /* Menyembunyikan scrollbar untuk WebKit (Chrome, Safari) */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        /* Menyembunyikan scrollbar untuk IE dan Edge */
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 space-y-20">
        {/* Carousel Lowongan Terbaru */}
        <JobCarousel
          title="Peluang Karir Terbaru"
          subtitle="Jelajahi lowongan yang paling baru dipublikasikan hari ini."
          jobs={latestJobs}
          link="/jobs"
        />

        {/* Carousel Pekerjaan di Sekitarmu */}
        <JobCarousel
          title="Pekerjaan di Sekitarmu"
          subtitle={nearbySubtitle}
          jobs={nearbyJobs}
          link="/jobs?location=nearby"
          isNearby={true} // Kustomisasi untuk CTA dan warna judul
        />
      </div>
    </section>
  );
}
