import Image from "next/image";

export default function Herop() {
  return (
    <section
      id="hero"
      className="relative h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/img/hero/hero-woman.jpg")' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-700/50 flex flex-col justify-between">
        {/* HERO TEXT & FILTER */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center gap-6 px-4 sm:px-8 md:px-16 -mt-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl font-bold text-white">
            Temukan Pekerjaan Impian Anda Hari Ini
          </h2>

          {/* Filter Box */}
          <div
            id="hero-filter-box"
            className="flex flex-col sm:flex-row flex-wrap gap-4 p-6 bg-white/20 backdrop-blur-sm rounded-sm shadow-lg border border-white/30 max-w-6xl w-full justify-center"
          >
            <input
              type="text"
              className="flex-1 min-w-[200px] bg-white text-black p-3 rounded-sm border border-transparent focus:border-blue-600 focus:outline-none"
              placeholder="Judul Pekerjaan, Perusahaan"
            />

            <input
              type="text"
              className="flex-1 min-w-[200px] bg-white text-black p-3 rounded-sm border border-transparent focus:border-blue-600 focus:outline-none"
              placeholder="Lokasi"
            />

            <select className="bg-white text-black px-4 py-3 rounded-sm border border-transparent focus:border-blue-600 focus:outline-none min-w-[180px]">
              <option value="">Kategori</option>
              <option value="jakarta">Teknologi</option>
              <option value="bandung">Keuangan</option>
              <option value="surabaya">Pemasaran</option>
            </select>

            <button className="bg-blue-700 py-3 px-8 text-white rounded-sm hover:bg-blue-800 transition cursor-pointer">
              CARI SEKARANG
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
