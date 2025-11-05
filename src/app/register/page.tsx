"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterFormData, registerSchema } from "./_schemas/registerSchema";
import axiosClient from "@/lib/axiosClient";
import AuthInput from "@/components/AuthInput";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await axiosClient.post("auth/register", data);
      toast.success("Registrasi berhasil!");
      setTimeout(() => router.push("/login"), 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Daftar Akun</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AuthInput
            label="Nama"
            {...register("name")}
            error={errors.name?.message}
          />
          <AuthInput
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <AuthInput
            label="Password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Role
            </label>
            <select
              {...register("role")}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none ${
                errors.role ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Pilih Role</option>
              <option value="JOB_SEEKER">Job Seeker</option>
              <option value="COMPANY_ADMIN">Company Admin</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {errorMsg && (
            <p className="text-red-500 text-center mb-2">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="text-green-600 text-center mb-2">{successMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Sudah punya akun?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            {" "}
            Masuk di sini
          </a>
        </p>
      </div>
    </main>
  );
}
