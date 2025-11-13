"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, HelpCircle, Mail, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fungsi logout dengan animasi fadeOut
  const handleLogout = () => {
    setIsLoggingOut(true);

    // Delay 300ms untuk animasi fadeOut
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/auth/login");
    }, 300);
  };

  return (
    <header
      className={`flex items-center justify-between h-16 bg-white border-b border-gray-200 px-6 sticky top-0 z-10 transition-opacity duration-300 ${
        isLoggingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Logo */}
      <div>
        <Link href="/" className="cursor-pointer">
          <Image
            src="/img/logo/logo-jobid-tr.png"
            alt="logo"
            width={100}
            height={100}
            priority
          />
        </Link>
      </div>

      {/* User Info & Actions */}
      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        <HelpCircle className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
        <Bell className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
        <Mail className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />

        {/* Username/Email */}
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="ml-4 text-sm font-medium text-gray-700 cursor-pointer select-none"
        >
          {loading ? "Loading..." : user?.email ?? "Guest"}
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute right-0 top-10 w-44 bg-white border border-gray-200 rounded-lg shadow-md py-2 animate-fadeIn">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
