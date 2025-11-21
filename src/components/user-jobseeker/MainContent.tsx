// components/MainContent.tsx

const MainContent = () => {
  return (
    <div className="space-y-6">
      {/* Pemberitahuan Inklusi */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex justify-between items-center">
        <p className="text-sm text-gray-700">
          Companies want to build inclusive teams, help us identify your
          disability status for better jobs.
        </p>
        <div className="flex space-x-2 ml-4">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white">
            I have a disability
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white">
            I don't have a disability
          </button>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg">
            Submit
          </button>
        </div>
      </div>

      {/* Bagian Recommended jobs */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Recommended jobs for you
          </h3>
          <a href="#" className="text-blue-600 text-sm font-medium">
            View all
          </a>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <JobCard
            title="Technical Support E..."
            company="Myhasis"
            rating={3.3}
            location="Pune"
          />
          <JobCard
            title="Service Desk Analy..."
            company="Wipro"
            rating={3.7}
            location="Bengaluru"
          />
          {/* ... kartu pekerjaan lainnya */}
        </div>
      </section>

      {/* Bagian Create your resume */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 flex justify-between items-center">
        <div className="flex items-start space-x-4">
          {/*  */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Create your resume in 3 easy steps 👇
            </h4>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li>Add the missing details in your profile</li>
              <li>Choose a template for your resume</li>
              <li>Improve the content with AI</li>
            </ol>
          </div>
        </div>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">
          Create Resume
        </button>
      </div>

      {/* Bagian Top companies */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Top companies</h3>
          <a href="#" className="text-blue-600 text-sm font-medium">
            View all
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <CompanyCard name="FICO" rating={3.5} reviews={56} />
          <CompanyCard
            name="Bathwari Engineeri..."
            rating={4.1}
            reviews={234}
          />
          {/* ... kartu perusahaan lainnya */}
        </div>
      </section>

      {/* Bagian Stay updated with our blogs */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Stay updated with our blogs
          </h3>
          <a href="#" className="text-blue-600 text-sm font-medium">
            View all
          </a>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <BlogCard title="How to Write an Introduction in 5 Steps with Examples (2025)..." />
          {/* ... kartu blog lainnya */}
        </div>
      </section>
    </div>
  );
};

// Contoh Komponen Kartu Pekerjaan
interface JobCardProps {
  title: string;
  company: string;
  rating: number;
  location: string;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  company,
  rating,
  location,
}) => (
  <div className="p-4 border rounded-lg min-w-[200px] w-[220px] shadow-sm hover:shadow-md transition bg-white">
    <h4 className="font-medium text-blue-700 truncate">{title}</h4>
    <div className="flex items-center text-xs text-gray-600 mt-1">
      <span>{company}</span>
      <span className="mx-1">|</span>
      <span className="bg-green-100 text-green-700 px-1 rounded font-bold">
        {rating} ⭐
      </span>
    </div>
    <p className="text-xs text-gray-500 mt-1">{location}</p>
    <p className="text-xs text-red-500 mt-2">1d ago</p>
  </div>
);

// Contoh Komponen Kartu Perusahaan
interface CompanyCardProps {
  name: string;
  rating: number;
  reviews: number;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ name, rating, reviews }) => (
  <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-white">
    <h4 className="font-semibold text-gray-800 truncate">{name}</h4>
    <div className="flex items-center text-sm mt-1">
      <span className="bg-green-100 text-green-700 px-1 rounded font-bold">
        {rating} ⭐
      </span>
      <span className="ml-2 text-xs text-gray-500">{reviews} reviews</span>
    </div>
    <button className="mt-3 text-blue-600 text-sm font-medium hover:underline">
      View jobs
    </button>
  </div>
);

// Contoh Komponen Kartu Blog
interface BlogCardProps {
  title: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ title }) => (
  <div className="border rounded-lg min-w-[250px] w-[280px] shadow-sm transition bg-white">
    <div className="h-24 bg-gray-200 rounded-t-lg">{/*  */}</div>
    <div className="p-3">
      <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
        {title}
      </h4>
      <p className="text-xs text-gray-500 mt-2">Naukri Blog • 7 Nov 2025</p>
    </div>
  </div>
);

export default MainContent;
