import { Briefcase, MapPin, Filter } from "lucide-react";

export default function Features() {
  const items = [
    {
      icon: <Briefcase className="w-8 h-8 text-[var(--brand-color)]" />,
      title: "Smart Job Matching",
      desc: "Get job recommendations tailored to your skills and location.",
    },
    {
      icon: <MapPin className="w-8 h-8 text-[var(--brand-color)]" />,
      title: "Location-Based Jobs",
      desc: "Find opportunities around your area with geolocation detection.",
    },
    {
      icon: <Filter className="w-8 h-8 text-[var(--brand-color)]" />,
      title: "Powerful Filters",
      desc: "Easily filter jobs by title, category, and company.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-8 text-center">
        <h2 className="text-3xl font-bold mb-12">Why Choose Job.id?</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl shadow-md hover:shadow-lg transition bg-gray-50"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
