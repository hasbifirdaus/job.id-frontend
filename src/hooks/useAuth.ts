"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";

interface User {
  id: string;
  name: string;
  email: string;
  role: "JOB_SEEKER" | "COMPANY_ADMIN";
  company_id?: number | null;
}

export const useAuth = (allowedRoles?: ("JOB_SEEKER" | "COMPANY_ADMIN")[]) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const fetchUser = async () => {
      try {
        // 🔹 Ambil data user dari backend (dengan tipe aman)
        const res = await axiosClient.get<{ user: User }>("/auth/me");
        const userData = res.data.user;

        // 🔹 Simpan user ke state & localStorage
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        // 🔹 Cek role
        if (allowedRoles && !allowedRoles.includes(userData.role)) {
          if (userData.role === "JOB_SEEKER")
            router.replace("/jobseeker/homeJobseeker");
          else if (userData.role === "COMPANY_ADMIN")
            router.replace("/companyAdmin/dashboard");
          else router.replace("/auth/login");
          return;
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, allowedRoles]);

  return { user, loading };
};
