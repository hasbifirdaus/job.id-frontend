"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRedirect = (path: string) => {
    setLoading(true);
    setTimeout(() => {
      router.push(path);
    });
  };

  return (
    <section
      id="Register"
      className="bg-cover bg-center bg-no-repeat h-screen flex flex-col justify-center items-center text-center px-6"
      style={{ backgroundImage: 'url("/img/register/register-bg.jpg")' }}
    >
      <div className="absolute inset-0 bg-gray-400/20 backdrop-blur-xs flex items-center justify-center -mt-48">
        <div className="w-6xl bg-white/40 backdrop-blur-sm rounded-sm shadow-lg border border-white/30 p-8">
          <div>
            <Link href="/" className="cursor-pointer">
              <Image
                src="/img/logo/logo-jobid-tr.png"
                alt="logo"
                className="mx-auto"
                width={200}
                height={200}
                quality={100}
                priority
              />
            </Link>
            <p className="text-blue-700 text-lg">
              Pilih jenis akun yang ingin kamu daftarkan di Job.id
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
              <h2 className="text-2xl font-semibold text-blue-700 mb-3">
                Untuk Pencari Kerja
              </h2>
              <p className="text-gray-600 mb-5">
                Daftarlah sebagai <span className="font-medium">Pelamar</span>{" "}
                jika kamu sedang mencari pekerjaan dan ingin melamar lowongan
                yang tersedia.
              </p>
              <button
                onClick={() =>
                  handleRedirect("/auth/register/registerEmployee")
                }
                disabled={loading}
                className={`bg-blue-700 hover:bg-blue-800 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-300 cursor-pointer mx-auto flex items-center justify-center ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Loading...
                  </div>
                ) : (
                  "Daftar sebagai Pelamar"
                )}
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
              <h2 className="text-2xl font-semibold text-blue-700 mb-3">
                Untuk Perusahaan
              </h2>
              <p className="text-gray-600 mb-5">
                Daftar sebagai <span className="font-medium">Company</span> jika
                kamu ingin memposting lowongan pekerjaan dan mengelola kandidat.
              </p>
              <button
                onClick={() =>
                  handleRedirect("/auth/register/registerAdminCompany")
                }
                disabled={loading}
                className={`bg-blue-700 hover:bg-blue-800 text-white font-semibold py-4 px-6 rounded-lg shadow-md transition-all duration-300 cursor-pointer mx-auto flex items-center justify-center ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Loading...
                  </div>
                ) : (
                  "Daftar sebagai Company"
                )}
              </button>
            </div>
          </div>

          <h3 className="text-lg mx-auto text-white mt-5">
            Sudah punya akun?{" "}
            <Link
              href="/auth/login"
              className="text-blue-700 hover:text-blue-800 hover:font-bold"
            >
              Masuk sekarang
            </Link>
          </h3>
        </div>
      </div>
    </section>
  );
}
