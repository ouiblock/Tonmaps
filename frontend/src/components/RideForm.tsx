import { useState } from 'react';
import { useMaps } from '../contexts/MapsContext';
import { Location } from '../types';

interface RideFormProps {
  onSubmit: (ride: {
    origin: Location;
    destination: Location;
    departureTime: string;
    seats: number;
    price: number;
  }) => void;
  type: 'offer' | 'search';
}

export default function RideForm({ onSubmit, type }: RideFormProps) {
  const { geocodeAddress } = useMaps();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    originAddress: '',
    destinationAddress: '',
    departureTime: '',
    seats: 1,
    price: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const [origin, destination] = await Promise.all([
        geocodeAddress(formData.originAddress),
        geocodeAddress(formData.destinationAddress)
      ]);

      onSubmit({
        origin,
        destination,
        departureTime: formData.departureTime,
        seats: formData.seats,
        price: formData.price
      });
    } catch (err) {
      setError('Failed to geocode addresses. Please check your input.');
      console.error('Geocoding error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="originAddress" className="block text-sm font-medium text-gray-300">
            Pickup Location
          </label>
          <input
            type="text"
            id="originAddress"
            name="originAddress"
            value={formData.originAddress}
            onChange={handleInputChange}
            placeholder="Enter pickup address"
            className="mt-1 block w-full rounded-md bg-[#242F3D] border-gray-700 text-white placeholder-gray-400 focus:border-[#2AABEE] focus:ring-[#2AABEE]"
            required
          />
        </div>

        <div>
          <label htmlFor="destinationAddress" className="block text-sm font-medium text-gray-300">
            Destination
          </label>
          <input
            type="text"
            id="destinationAddress"
            name="destinationAddress"
            value={formData.destinationAddress}
            onChange={handleInputChange}
            placeholder="Enter destination address"
            className="mt-1 block w-full rounded-md bg-[#242F3D] border-gray-700 text-white placeholder-gray-400 focus:border-[#2AABEE] focus:ring-[#2AABEE]"
            required
          />
        </div>

        <div>
          <label htmlFor="departureTime" className="block text-sm font-medium text-gray-300">
            Departure Time
          </label>
          <input
            type="datetime-local"
            id="departureTime"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md bg-[#242F3D] border-gray-700 text-white focus:border-[#2AABEE] focus:ring-[#2AABEE]"
            required
          />
        </div>

        {type === 'offer' && (
          <>
            <div>
              <label htmlFor="seats" className="block text-sm font-medium text-gray-300">
                Available Seats
              </label>
              <input
                type="number"
                id="seats"
                name="seats"
                value={formData.seats}
                onChange={handleInputChange}
                min="1"
                max="8"
                className="mt-1 block w-full rounded-md bg-[#242F3D] border-gray-700 text-white focus:border-[#2AABEE] focus:ring-[#2AABEE]"
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                Price per Seat (TON)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className="mt-1 block w-full rounded-md bg-[#242F3D] border-gray-700 text-white focus:border-[#2AABEE] focus:ring-[#2AABEE]"
                required
              />
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2AABEE] hover:bg-[#2AABEE]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2AABEE] disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : type === 'offer' ? 'Create Ride Offer' : 'Search Rides'}
      </button>
    </form>
  );
}
