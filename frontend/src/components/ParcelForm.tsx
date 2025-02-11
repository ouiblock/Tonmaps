import { useState } from 'react';
import { Location } from '../types';
import { useMaps } from '../contexts/MapsContext';

interface ParcelFormProps {
  type: 'send' | 'search';
  onSubmit: (data: {
    origin: Location;
    destination: Location;
    parcelSize: 'small' | 'medium' | 'large';
    weight: number;
    price?: string;
    description?: string;
    fragile: boolean;
    insurance?: {
      amount: string;
      currency: 'TON';
    };
  }) => void;
}

export default function ParcelForm({ type, onSubmit }: ParcelFormProps) {
  const { geocodeAddress } = useMaps();
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [parcelSize, setParcelSize] = useState<'small' | 'medium' | 'large'>('small');
  const [weight, setWeight] = useState(1);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [fragile, setFragile] = useState(false);
  const [insuranceAmount, setInsuranceAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const pickup = await geocodeAddress(pickupAddress);
      const destination = await geocodeAddress(destinationAddress);

      if (!pickup || !destination) {
        setError('Invalid addresses. Please try again.');
        return;
      }

      const data = {
        origin: pickup,
        destination,
        parcelSize,
        weight,
        fragile,
        ...(type === 'send' && {
          price,
          description,
          ...(insuranceAmount && {
            insurance: {
              amount: insuranceAmount,
              currency: 'TON' as const
            }
          })
        })
      };

      onSubmit(data);
    } catch (err) {
      setError('Failed to process addresses. Please try again.');
      console.error('Parcel form error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Pickup Location
        </label>
        <input
          type="text"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
          placeholder="Enter pickup address"
          className="w-full px-4 py-2 bg-[#1C2431] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AABEE]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Destination
        </label>
        <input
          type="text"
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.target.value)}
          placeholder="Enter destination address"
          className="w-full px-4 py-2 bg-[#1C2431] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AABEE]"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Parcel Size
          </label>
          <select
            value={parcelSize}
            onChange={(e) => setParcelSize(e.target.value as 'small' | 'medium' | 'large')}
            className="w-full px-4 py-2 bg-[#1C2431] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AABEE]"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            min="0.1"
            step="0.1"
            className="w-full px-4 py-2 bg-[#1C2431] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AABEE]"
            required
          />
        </div>
      </div>

      {type === 'send' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Price (TON)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0.1"
              step="0.1"
              placeholder="Enter price in TON"
              className="w-full px-4 py-2 bg-[#1C2431] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AABEE]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter parcel description"
              className="w-full px-4 py-2 bg-[#1C2431] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AABEE]"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={fragile}
                onChange={(e) => setFragile(e.target.checked)}
                className="h-4 w-4 text-[#2AABEE] focus:ring-[#2AABEE] bg-[#1C2431] border-gray-600 rounded"
              />
              <label className="ml-2 text-sm text-gray-400">
                Fragile Item
              </label>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Insurance Amount (TON, optional)
              </label>
              <input
                type="number"
                value={insuranceAmount}
                onChange={(e) => setInsuranceAmount(e.target.value)}
                min="0.1"
                step="0.1"
                placeholder="Enter insurance amount"
                className="w-full px-4 py-2 bg-[#1C2431] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AABEE]"
              />
            </div>
          </div>
        </>
      )}

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button
        type="submit"
        className="w-full px-4 py-2 bg-[#2AABEE] text-white rounded-lg hover:bg-[#2AABEE]/80 transition-colors"
      >
        {type === 'send' ? 'Create Delivery Request' : 'Search Deliveries'}
      </button>
    </form>
  );
}
