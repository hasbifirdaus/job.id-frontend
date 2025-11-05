"use client";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-blue-600">Job.id</h1>
        <ul className="hidden md:flex gap-6">
          <li>
            <a href="#filter" className="hover:text-blue-600">
              Find Jobs
            </a>
          </li>
          <li>
            <a href="#discovery" className="hover:text-blue-600">
              Discover
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">
              For Employers
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">
              Login
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
