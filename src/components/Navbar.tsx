"use client";
import { useEffect, useState } from "react";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      setIsScrolled(window.scrollY > heroHeight / 3);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    {
      label: "Login",
      href: "/auth/login",
      icon: <LogIn size={20} />,
    },
    {
      label: "Register",
      href: "/auth/register",
      icon: <UserPlus size={20} />,
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-md text-blue-700"
          : "bg-transparent text-white"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        {/* LOGO */}
        <h1
          onClick={() => router.push("/")}
          className={`text-4xl font-bold transition-colors duration-700 cursor-pointer ${
            isScrolled
              ? "text-blue-700 hover:text-blue-500"
              : "text-white hover:text-blue-300"
          }`}
        >
          Job.id
        </h1>

        {/* MENU DESKTOP */}
        <ul className="hidden md:flex gap-4 font-semibold text-lg">
          {menuItems.map((item, i) => (
            <li key={i}>
              <a
                href={item.href}
                className={`flex items-center gap-2 px-5 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800 shadow-md hover:shadow-lg transition-all duration-300`}
              >
                {item.icon}
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* BURGER BUTTON (MOBILE) */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden transition-transform duration-300"
        >
          <Menu
            size={28}
            className={`transition-colors duration-700 ${
              isScrolled ? "text-blue-700" : "text-white"
            }`}
          />
        </button>
      </div>

      {/* OVERLAY HITAM SAAT MENU TERBUKA */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* SIDE DRAWER MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-3/4 sm:w-1/2 bg-white shadow-2xl transform transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-blue-700">Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <X
              size={28}
              className="text-gray-800 hover:text-blue-700 transition"
            />
          </button>
        </div>

        {/* Menu Mobile */}
        <ul className="flex flex-col p-6 gap-6 text-lg font-medium">
          {menuItems.map((item, i) => (
            <li key={i}>
              <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 px-5 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800 shadow-md hover:shadow-lg transition-all duration-300"
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
