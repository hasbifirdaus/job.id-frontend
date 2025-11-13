import Navbar from "@/components/Navbar";
import Hero from "@/components/landing-page/Hero";
import Discovery from "@/components/landing-page/Discovery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        <Hero />
        <Discovery />
      </main>
      <Footer />
    </>
  );
}
