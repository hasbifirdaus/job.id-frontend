// components/AdContainer.tsx

const AdContainer = () => {
  return (
    <div className="space-y-6">
      {/* Kartu 'How to Write an Introduction' */}
      <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300">
        <h4 className="font-semibold text-gray-800 mb-2">
          How to Write an Introduction...
        </h4>
        {/*  */}
        <p className="text-xs text-gray-600 mb-3">Know more</p>
        <button className="text-blue-600 text-xs font-medium hover:underline">
          Read now
        </button>
      </div>

      {/* QR Code dan Download App */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
        {/*  */}
        <p className="text-sm font-medium mt-2">
          350+ downloaded in last 30 min!
        </p>
        <p className="text-xs text-gray-500">Scan to download from 👉</p>
      </div>
    </div>
  );
};

export default AdContainer;
