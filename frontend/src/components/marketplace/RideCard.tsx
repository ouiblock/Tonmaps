import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useWallet } from '@/contexts/WalletContext';

interface RideCardProps {
  ride: {
    id: string;
    from: string;
    to: string;
    date: Date;
    price: number;
    seats: number;
    driver: {
      name: string;
      rating: number;
      completedRides: number;
    };
  };
  onSelect: (rideId: string) => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onSelect }) => {
  const { address } = useWallet();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{ride.from} → {ride.to}</h3>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(ride.date), { addSuffix: true })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600">{ride.price} TON</p>
            <p className="text-sm text-gray-500">{ride.seats} seats available</p>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-semibold">
              {ride.driver.name.charAt(0)}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{ride.driver.name}</p>
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600 ml-1">
                {ride.driver.rating} · {ride.driver.completedRides} rides
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onSelect(ride.id)}
          disabled={!address}
          className={`w-full py-2 px-4 rounded-lg font-medium ${
            address
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {address ? 'Book Now' : 'Connect Wallet to Book'}
        </button>
      </div>
    </div>
  );
};

export default RideCard;
