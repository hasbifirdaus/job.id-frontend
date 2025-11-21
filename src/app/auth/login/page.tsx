"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { useRouter } from "next/navigation";
import { loginValidationSchema } from "./_schemas/loginValidation";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "JOB_SEEKER" | "COMPANY_ADMIN";
    company_id?: number | null;
  };
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setErrors({});

    try {
      // 🔹 Validasi input
      await loginValidationSchema.validate(
        { email, password },
        { abortEarly: false }
      );

      const res = await axiosClient.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "JOB_SEEKER") router.push("/home-jobseeker");
      else if (user.role === "COMPANY_ADMIN") router.push("/dashboard");
      else router.push("/");
    } catch (err: any) {
      if (err.name === "ValidationError") {
        const fieldErrors: any = {};
        err.inner.forEach((e: any) => {
          if (e.path) fieldErrors[e.path] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        alert(
          err.response?.data?.message ||
            "Login gagal, periksa email dan password"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <section
      className="bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center"
      style={{ backgroundImage: 'url("/img/login/login-bg.jpg")' }}
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
              quality={100}
              priority
            />
          </Link>

          {/* Tombol Google */}
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 border-2 border-gray-300 rounded-full bg-white hover:bg-gray-100 text-gray-700 p-3 w-md mx-auto transition mt-10 cursor-pointer"
          >
            <Image
              src="/img/register/google-icon-logo.png"
              alt="Google Icon"
              width={24}
              height={24}
            />
            <span>Masuk dengan Google</span>
          </button>

          <h3 className="grid items-center justify-center p-3 mt-4 text-white">
            Atau
          </h3>

          <div className="grid items-center justify-center gap-5">
            {/* Input Email */}
            <div className="w-md mx-auto">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`bg-white border-2 rounded-full p-3 w-full focus:outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-200 focus:border-blue-600"
                }`}
              />
              <div className="min-h-[1.25rem] w-full text-center">
                {errors.email && (
                  <p className="text-red-500 text-sm my-2 ">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Input Password dengan ikon mata 👁️ */}
            <div className="w-md mx-auto relative -mt-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`bg-white border-2 rounded-full p-3 w-full focus:outline-none pr-10 ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-200 focus:border-blue-600"
                }`}
              />

              {/* Tombol show/hide password */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute -mt-2 right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>

              <div className="min-h-[1.25rem] w-full text-center">
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Tombol Login */}
            <button
              onClick={handleLogin}
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
                "Masuk"
              )}
            </button>

            <h3 className="mx-auto text-white">
              Belum punya akun?{" "}
              <Link
                href="/auth/register"
                className="text-blue-700 font-bold hover:text-blue-800"
              >
                Daftar sekarang
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
