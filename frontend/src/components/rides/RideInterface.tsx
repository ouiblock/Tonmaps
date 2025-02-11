import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Image from 'next/image';

interface Ride {
  id: string;
  driver: {
    name: string;
    avatar: string;
    rating: number;
  };
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  seats: number;
}

const mockRides: Ride[] = [
  {
    id: '1',
    driver: {
      name: 'John Doe',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      rating: 4.8,
    },
    from: 'Paris',
    to: 'Lyon',
    date: '2025-02-06',
    time: '09:00',
    price: 35,
    seats: 3,
  },
  {
    id: '2',
    driver: {
      name: 'Jane Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
      rating: 4.9,
    },
    from: 'Paris',
    to: 'Marseille',
    date: '2025-02-06',
    time: '10:30',
    price: 65,
    seats: 2,
  },
  {
    id: '3',
    driver: {
      name: 'Mike Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      rating: 4.7,
    },
    from: 'Paris',
    to: 'Bordeaux',
    date: '2025-02-06',
    time: '11:15',
    price: 55,
    seats: 4,
  },
];

interface RideCardProps {
  ride: Ride;
  onBook: (ride: Ride) => void;
}

const RideCard = ({ ride, onBook }: RideCardProps) => {
  return (
    <div className="bg-[#242F3D] rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Image
            src={ride.driver.avatar}
            alt={ride.driver.name}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <h3 className="text-white font-semibold">{ride.driver.name}</h3>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-gray-400 text-sm">{ride.driver.rating}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">${ride.price}</div>
          <div className="text-gray-400 text-sm">{ride.seats} seats left</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <div className="flex-1">
            <div className="text-white">{ride.from}</div>
            <div className="text-gray-400 text-sm">{ride.time}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <div className="flex-1">
            <div className="text-white">{ride.to}</div>
            <div className="text-gray-400 text-sm">~2h30</div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onBook(ride)}
        className="mt-4 w-full px-4 py-2 rounded-lg bg-[#2AABEE] text-white hover:bg-[#2AABEE]/80 transition-colors"
      >
        Book Ride
      </button>
    </div>
  );
};

interface BookingModalProps {
  ride: Ride;
  onClose: () => void;
  onConfirm: () => void;
}

const BookingModal = ({ ride, onClose, onConfirm }: BookingModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#242F3D] rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-white mb-4">Confirm Booking</h3>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-400">From</span>
            <span className="text-white">{ride.from}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">To</span>
            <span className="text-white">{ride.to}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Date</span>
            <span className="text-white">{ride.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Time</span>
            <span className="text-white">{ride.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Price</span>
            <span className="text-white font-bold">${ride.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">TON Rewards</span>
            <span className="text-[#2AABEE] font-bold">{ride.price * 0.1} TON</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg bg-[#2AABEE] text-white hover:bg-[#2AABEE]/80"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export const RideInterface = () => {
  const { user, addScore } = useAuth();
  const [rides] = useState<Ride[]>(mockRides);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  const handleBook = (ride: Ride) => {
    setSelectedRide(ride);
  };

  const handleConfirmBooking = () => {
    if (selectedRide) {
      // Add points (10 points per dollar)
      addScore(selectedRide.price * 10);
      setSelectedRide(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Available Rides</h2>
        <p className="text-gray-400">Find and book rides to your destination</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rides.map(ride => (
          <RideCard
            key={ride.id}
            ride={ride}
            onBook={handleBook}
          />
        ))}
      </div>

      {selectedRide && (
        <BookingModal
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};
