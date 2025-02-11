import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useWallet } from '@/contexts/WalletContext';

interface ParcelCardProps {
  parcel: {
    id: string;
    from: string;
    to: string;
    deadline: Date;
    reward: number;
    size: 'small' | 'medium' | 'large';
    weight: number;
    sender: {
      name: string;
      rating: number;
      completedDeliveries: number;
    };
  };
  onSelect: (parcelId: string) => void;
}

const ParcelCard: React.FC<ParcelCardProps> = ({ parcel, onSelect }) => {
  const { address } = useWallet();

  const getSizeIcon = (size: string) => {
    switch (size) {
      case 'small':
        return '📦';
      case 'medium':
        return '📫';
      case 'large':
        return '📪';
      default:
        return '📦';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{parcel.from} → {parcel.to}</h3>
            <p className="text-sm text-gray-500">
              Deadline: {formatDistanceToNow(new Date(parcel.deadline), { addSuffix: true })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600">{parcel.reward} TON</p>
            <p className="text-sm text-gray-500">{getSizeIcon(parcel.size)} {parcel.weight}kg</p>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-semibold">
              {parcel.sender.name.charAt(0)}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{parcel.sender.name}</p>
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600 ml-1">
                {parcel.sender.rating} · {parcel.sender.completedDeliveries} deliveries
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onSelect(parcel.id)}
          disabled={!address}
          className={`w-full py-2 px-4 rounded-lg font-medium ${
            address
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {address ? 'Accept Delivery' : 'Connect Wallet to Accept'}
        </button>
      </div>
    </div>
  );
};

export default ParcelCard;
