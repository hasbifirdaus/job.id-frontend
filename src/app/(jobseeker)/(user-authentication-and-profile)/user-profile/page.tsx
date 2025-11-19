"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import ProfileForm from "@/components/(user-authentication-and-profiles-component)/user-profile/ProfileFormComponents";
import EmailUpdateForm from "@/components/(user-authentication-and-profiles-component)/user-profile/EmailUpdateFormComponents";
import UserDetailForm from "@/components/(user-authentication-and-profiles-component)/user-profile/UserDetailFormComponents";
import axiosClient from "@/lib/axiosClient";

interface ProfileResponse {
  data: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    profile_image_url: string;
    role: UserRole;
    dob?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    education?: string;
    address?: string;
  };
}

type UserRole = "JOB_SEEKER" | "COMPANY_ADMIN";

interface UserData {
  id: string;
  name: string;
  email: string;
  verified: boolean;
  profile_image_url: string;
  role: UserRole;
  dob?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  education?: string;
  address?: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Implementasi fetching data dari API (Endpoint 1: GET /api/profile)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get<ProfileResponse>("/profile");

        const backendData = response.data.data;
        setUserData({
          id: backendData.id,
          name: backendData.name,
          email: backendData.email,
          verified: backendData.verified,
          profile_image_url: backendData.profile_image_url,
          role: backendData.role,
          dob: backendData.dob ? backendData.dob.split("T")[0] : undefined,
          gender: backendData.gender,
          education: backendData.education,
          address: backendData.address,
        });
      } catch (err) {
        setError("Gagal memuat data profil.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memuat Profil...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  }

  // Jika data profil belum dimuat (meskipun harusnya ditangkap oleh error/loading)
  if (!userData) return null;

  const isJobSeeker = userData.role === "JOB_SEEKER";

  return (
    <>
      <Head>
        <title>Profile Saya | EventUp</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-3xl mx-auto px-4">
          {/* JUDUL HALAMAN */}
          <h1 className="text-3xl font-semibold text-gray-800 mb-8">
            ⚙️ Pengaturan Profil
          </h1>

          {/* WRAPPER UTAMA */}
          <div className="space-y-6">
            {/* CARD: Profile Photo & Basic */}
            <div className="bg-white shadow-sm rounded-xl border p-6">
              <ProfileForm userData={userData} setUserData={setUserData} />
            </div>

            {/* CARD: Update Email */}
            <div className="bg-white shadow-sm rounded-xl border p-6">
              <EmailUpdateForm userData={userData} setUserData={setUserData} />
            </div>

            {/* CARD: Data Tambahan Untuk Job Seeker */}
            {isJobSeeker && (
              <div className="bg-white shadow-sm rounded-xl border p-6">
                <UserDetailForm userData={userData} setUserData={setUserData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
