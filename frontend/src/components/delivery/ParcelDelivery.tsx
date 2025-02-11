import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Image from 'next/image';

interface ParcelDeliveryProps {
  type: 'p2p' | 'business';
}

interface Parcel {
  id: string;
  from: string;
  to: string;
  size: 'small' | 'medium' | 'large';
  weight: number;
  price: number;
  description: string;
  sender: {
    name: string;
    rating: number;
    type: 'individual' | 'business';
  };
}

const mockParcels: Parcel[] = [
  {
    id: '1',
    from: '123 Main St, Paris',
    to: '456 Oak Ave, Lyon',
    size: 'small',
    weight: 2.5,
    price: 15,
    description: 'Small package containing books',
    sender: {
      name: 'Marie Dupont',
      rating: 4.8,
      type: 'individual'
    }
  },
  {
    id: '2',
    from: 'Amazon Warehouse, Marseille',
    to: '789 Pine St, Nice',
    size: 'medium',
    weight: 5,
    price: 25,
    description: 'Electronics package',
    sender: {
      name: 'Amazon France',
      rating: 4.9,
      type: 'business'
    }
  },
  {
    id: '3',
    from: '321 Elm St, Bordeaux',
    to: '654 Maple Ave, Toulouse',
    size: 'large',
    weight: 8,
    price: 35,
    description: 'Furniture package',
    sender: {
      name: 'Pierre Martin',
      rating: 4.7,
      type: 'individual'
    }
  }
];

export const ParcelDelivery = ({ type }: ParcelDeliveryProps) => {
  const { user, addScore } = useAuth();
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const filteredParcels = mockParcels.filter(parcel => 
    type === 'business' ? parcel.sender.type === 'business' : parcel.sender.type === 'individual'
  );

  const handleAcceptDelivery = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setShowConfirmation(true);
  };

  const confirmDelivery = () => {
    if (selectedParcel) {
      // In a real app, this would make an API call
      addScore(50); // Add points for accepting a delivery
      setShowConfirmation(false);
      setSelectedParcel(null);
      alert('Delivery accepted! Check your Telegram for details.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        {type === 'business' ? 'Business Deliveries' : 'Peer-to-Peer Deliveries'}
      </h2>

      <div className="grid gap-6">
        {filteredParcels.map(parcel => (
          <div
            key={parcel.id}
            className="bg-[#242F3D] rounded-xl p-6 flex flex-col md:flex-row items-start gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#2AABEE]/20 flex items-center justify-center">
                  {parcel.sender.type === 'business' ? (
                    <svg className="w-6 h-6 text-[#2AABEE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-[#2AABEE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{parcel.sender.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {parcel.sender.rating}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-gray-300">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#2AABEE] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-400">From</div>
                    {parcel.from}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#2AABEE] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-400">To</div>
                    {parcel.to}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#2AABEE] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-400">Package Details</div>
                    {parcel.description} ({parcel.weight}kg, {parcel.size})
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 ml-auto">
              <div className="text-2xl font-bold text-white">{parcel.price} TON</div>
              <button
                onClick={() => handleAcceptDelivery(parcel)}
                className="px-6 py-3 rounded-xl bg-[#2AABEE] text-white hover:bg-[#2AABEE]/80 transition-colors"
              >
                Accept Delivery
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedParcel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#242F3D] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Delivery</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to accept this delivery? You will earn 50 TON points upon completion.
            </p>
            <div className="flex gap-4">
              <button
                onClick={confirmDelivery}
                className="flex-1 px-6 py-3 rounded-xl bg-[#2AABEE] text-white hover:bg-[#2AABEE]/80"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-6 py-3 rounded-xl bg-red-500/20 text-red-500 hover:bg-red-500/30"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
