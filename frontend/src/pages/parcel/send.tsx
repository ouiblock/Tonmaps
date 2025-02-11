import { useEffect, useState } from 'react';

export default function ParcelSend() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-[#2D2D2D] rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Send a Package</h1>
        
        {/* Package Form */}
        <div className="space-y-6">
          {/* Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Pickup Location</label>
              <input
                type="text"
                placeholder="Enter pickup location"
                className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#2D2D2D]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Delivery Location</label>
              <input
                type="text"
                placeholder="Enter delivery location"
                className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#2D2D2D]"
              />
            </div>
          </div>
          
          {/* Package Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Package Size</label>
              <select className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#2D2D2D]">
                <option value="small">Small (up to 5kg)</option>
                <option value="medium">Medium (up to 15kg)</option>
                <option value="large">Large (up to 30kg)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Delivery Speed</label>
              <select className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#2D2D2D]">
                <option value="standard">Standard (2-3 days)</option>
                <option value="express">Express (1 day)</option>
                <option value="instant">Instant (2-4 hours)</option>
              </select>
            </div>
          </div>
          
          {/* Additional Details */}
          <div>
            <label className="block text-sm font-medium mb-2">Package Description</label>
            <textarea
              placeholder="Enter package details..."
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#2D2D2D]"
            />
          </div>
          
          <button className="w-full bg-[#38D39F] text-white py-3 rounded-lg font-medium hover:bg-[#2AA57F] transition-colors">
            Request Delivery
          </button>
        </div>
      </div>
    </div>
  );
}
