"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerValidationSchema } from "./_schemas/registerValidationSchema";

interface IFormInputs {
  name: string;
  email: string;
  password: string;
}

interface IRegisterResponse {
  message: string;
}

export default function RegisterEmployee() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(registerValidationSchema),
  });

  const onSubmit = async (data: IFormInputs) => {
    if (loading) return;
    setLoading(true);

    try {
      await axiosClient.post<IRegisterResponse>(
        "/auth/register/jobseeker",
        data
      );

      // ✅ Simpan data sementara ke localStorage
      localStorage.setItem("companyEmail", data.email);
      localStorage.setItem("companyPassword", data.password);

      // ✅ Redirect ke halaman Setup Account
      router.push("/auth/register/registerAdminCompany/setupAccount");
    } catch (err: any) {
      console.error(err);
      const message =
        err.response?.data?.message || "Pendaftaran gagal. Cek input Anda";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <section
      className="bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url("/img/register/register-employee-bg.jpg")',
      }}
    >
      <div className="absolute inset-0 bg-gray-400/20 backdrop-blur-xs grid items-center justify-center -mt-52">
        <div className="grid items-center justify-center">
          {/* LOGO */}
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
            onClick={handleGoogleRegister}
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

          <h3 className="grid items-center justify-center p-3 mt-4 text-white">
            Atau
          </h3>

          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid items-center justify-center mt-4"
          >
            {/* Nama */}
            <div className="w-md mx-auto">
              <input
                type="text"
                placeholder="Nama"
                {...register("name")}
                className="bg-white border-2 border-gray-200 rounded-sm p-3 w-full focus:border-blue-600 focus:outline-none"
              />
              <div className="min-h-[1.25rem] w-full text-center">
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="w-md mx-auto">
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="bg-white border-2 border-gray-200 rounded-sm p-3 w-full focus:border-blue-600 focus:outline-none"
              />
              <div className="min-h-[1.25rem] w-full text-center">
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="w-md mx-auto relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
                className="bg-white border-2 border-gray-200 rounded-sm p-3 w-full focus:border-blue-600 focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute -mt-2 right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>

              <div className="min-h-[1.25rem] w-full text-center">
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Tombol Daftar */}
            <button
              type="submit"
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
          </form>

          <h3 className="text-lg mx-auto mt-5 text-white">
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
