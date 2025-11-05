import Discovery from "@/components/Discovery";

import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import JobFilter from "@/components/JobFilter";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        <Hero />
        <JobFilter />
        <Discovery />
      </main>
      <Footer />
    </>
  );
}
