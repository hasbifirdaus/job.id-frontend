"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { setupAccountCompanyValidationSchema } from "./_schemas/setupAccountValidation";
import { InferType } from "yup";

// ✅ Ambil tipe otomatis dari schema Yup
type SetupFormInputs = InferType<typeof setupAccountCompanyValidationSchema>;

// ✅ Tipe response dari backend
interface RegisterCompanyResponse {
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
}

export default function SetupAccountCompany() {
  const router = useRouter();

  // ✅ Setup form + resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupFormInputs>({
    resolver: yupResolver(setupAccountCompanyValidationSchema) as any, // 🔧 FIX mismatch tipe
    defaultValues: {
      companyDescription: "", // tetap string kosong agar tidak bentrok dengan null
    },
  });

  // ✅ Ambil email & password dari localStorage
  const companyEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("companyEmail") || ""
      : "";
  const companyPassword =
    typeof window !== "undefined"
      ? localStorage.getItem("companyPassword") || ""
      : "";

  // ✅ Handler submit
  const onSubmit: SubmitHandler<SetupFormInputs> = async (data) => {
    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim();

      const payload = {
        name: fullName,
        email: companyEmail,
        password: companyPassword,
        companyName: data.companyName,
        companyPhone: data.companyPhone,
        companyLocation: data.companyLocation,
        companyDescription: data.companyDescription || "",
      };

      const response = await axiosClient.post<RegisterCompanyResponse>(
        "/auth/register/company",
        payload
      );

      toast.success("Akun perusahaan berhasil dibuat!");

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error: any) {
      console.error("Register error:", error);
      toast.error(error.response?.data?.message || "Registrasi gagal!");
    }
  };

  return (
    <div className="min-h-screen pt-12 lg:pt-36 pb-24 bg-white flex flex-col items-center font-sans">
      <div className="w-full max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-normal text-gray-900 mb-10">
          Create an employer account
        </h2>

        <div className="mb-10">
          <Link
            href="/auth/register"
            className="text-blue-700 hover:text-blue-900 font-semibold text-sm transition-all flex items-center"
          >
            I'm looking for a job
            <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-200" />
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Name */}
          <div>
            <label className="block text-lg text-gray-700 font-medium mb-1">
              Company Name <span className="text-red-600">*</span>
            </label>
            <input
              {...register("companyName")}
              type="text"
              placeholder="Masukkan nama perusahaan"
              className="w-full border-b border-gray-400 focus:border-blue-700 focus:ring-0 p-2 text-base"
            />
            {errors.companyName && (
              <p className="text-red-600 text-sm mt-1">
                {errors.companyName.message}
              </p>
            )}
          </div>

          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg text-gray-700 font-medium mb-1">
                First Name <span className="text-red-600">*</span>
              </label>
              <input
                {...register("firstName")}
                type="text"
                placeholder="Masukkan nama depan"
                className="w-full border-b border-gray-400 focus:border-blue-700 p-2 text-base"
              />
              {errors.firstName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-lg text-gray-700 font-medium mb-1">
                Last Name <span className="text-red-600">*</span>
              </label>
              <input
                {...register("lastName")}
                type="text"
                placeholder="Masukkan nama belakang"
                className="w-full border-b border-gray-400 focus:border-blue-700 p-2 text-base"
              />
              {errors.lastName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Company Phone */}
          <div>
            <label className="block text-lg text-gray-700 font-medium mb-1">
              Company Phone <span className="text-red-600">*</span>
            </label>
            <input
              {...register("companyPhone")}
              type="text"
              placeholder="Contoh: +62 812-3456-7890"
              className="w-full border-b border-gray-400 focus:border-blue-700 p-2 text-base"
            />
            {errors.companyPhone && (
              <p className="text-red-600 text-sm mt-1">
                {errors.companyPhone.message}
              </p>
            )}
          </div>

          {/* Company Location */}
          <div>
            <label className="block text-lg text-gray-700 font-medium mb-1">
              Company Location <span className="text-red-600">*</span>
            </label>
            <input
              {...register("companyLocation")}
              type="text"
              placeholder="Masukkan lokasi perusahaan"
              className="w-full border-b border-gray-400 focus:border-blue-700 p-2 text-base"
            />
            {errors.companyLocation && (
              <p className="text-red-600 text-sm mt-1">
                {errors.companyLocation.message}
              </p>
            )}
          </div>

          {/* Description (optional) */}
          <div>
            <label className="block text-lg text-gray-700 font-medium mb-1">
              Description (optional)
            </label>
            <textarea
              {...register("companyDescription")}
              placeholder="Ceritakan tentang perusahaan Anda (opsional)"
              className="w-full border-b border-gray-400 focus:border-blue-700 p-2 text-base"
              rows={3}
            />
            {errors.companyDescription && (
              <p className="text-red-600 text-sm mt-1">
                {errors.companyDescription.message}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-8">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 font-semibold py-2 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
