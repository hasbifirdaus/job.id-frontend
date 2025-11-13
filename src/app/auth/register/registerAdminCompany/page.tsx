"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { registerCompanyValidation } from "./_schemas/registerAdminCompanyValidation";
import { useRouter } from "next/navigation";

export default function RegisterCompany() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);
    setErrors({});

    try {
      // 🔹 Validasi Yup
      await registerCompanyValidation.validate(
        { email, password },
        { abortEarly: false }
      );

      // 🔹 Simpan ke localStorage untuk step berikutnya
      localStorage.setItem("companyEmail", email);
      localStorage.setItem("companyPassword", password);

      // 🔹 Redirect ke setup account
      router.push("registerAdminCompany/setupAccount");
    } catch (err: any) {
      if (err.inner && Array.isArray(err.inner)) {
        const newErrors: any = {};
        err.inner.forEach((e: any) => {
          newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ email: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url("/img/register/register-company-bg.jpg")',
      }}
    >
      <div className="absolute inset-0 bg-gray-400/20 backdrop-blur-xs grid items-center justify-center -mt-52">
        <div>
          <Link href="/" className="cursor-pointer">
            <Image
              src="/img/logo/logo-jobid-tr.png"
              alt="logo"
              className="mx-auto"
              width={200}
              height={200}
              priority
            />
          </Link>

          <button
            onClick={() => alert("Google register belum diaktifkan")}
            className="flex items-center justify-center gap-3 border-2 border-gray-300 rounded-sm bg-white hover:bg-gray-100 text-gray-700 p-3 w-md mx-auto transition mt-10 cursor-pointer"
          >
            <Image
              src="/img/register/google-icon-logo.png"
              alt="Google Icon"
              width={24}
              height={24}
            />
            <span>Daftar dengan Google</span>
          </button>

          <h3 className="grid items-center justify-center p-3 text-white">
            Atau
          </h3>

          <div className="grid items-center justify-center gap-5">
            {/* Input Email */}
            <div className="w-md">
              <input
                type="email"
                placeholder="Email Perusahaan"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`bg-white border-2 ${
                  errors.email ? "border-red-500" : "border-gray-200"
                } rounded-sm p-3 w-full focus:border-blue-600 focus:outline-none`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Input Password */}
            <div className="relative w-md">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`bg-white border-2 ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } rounded-sm p-3 w-full focus:border-blue-600 focus:outline-none`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Tombol Daftar */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className={`flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 rounded-full text-white p-4 w-52 mx-auto cursor-pointer transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Memproses...</span>
                </>
              ) : (
                "Daftar"
              )}
            </button>

            <h3 className="text-lg mx-auto text-white">
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
      </div>
    </section>
  );
}
