export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-200 py-10 ">
      <div className="max-w-6xl mx-auto text-center space-y-4">
        <h3 className="text-xl font-semibold">Job.id</h3>
        <p>
          Platform terpercaya untuk pencari kerja & pemberi kerja di Indonesia.
        </p>
        <div className="flex justify-center gap-6 text-sm text-gray-400">
          <a href="#">Tentang Kami</a>
          <a href="#">Kebijakan Privasi</a>
          <a href="#">Kontak</a>
        </div>
        <p className="text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} Job.id — All rights reserved.
        </p>
      </div>
    </footer>
  );
}
