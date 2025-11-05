"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginFormData, loginSchema } from "./_schemas/loginSchema";
import axiosClient from "@/lib/axiosClient";
import AuthInput from "@/components/AuthInput";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface ILoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await axiosClient.post<ILoginResponse>("auth/login", data);
      Cookies.set("token", res.data.token, { expires: 2 });
      toast.success("Login berhasil!");
      setTimeout(() => router.push("/"), 1200);
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Login gagal! Email atau password salah"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
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

            {errorMsg && (
              <p className="text-red-500 text-center mb-2">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition my-4"
            >
              {loading ? "Memproses.." : "Masuk"}
            </button>
          </form>

          <p>
            Belum punya akun?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Daftar sekarang
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
