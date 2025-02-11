import { useState } from 'react';
import { RideListing, User } from '../../types';

interface BookingModalProps {
  ride: RideListing;
  onClose: () => void;
  onConfirm: (seats: number) => void;
}

export const BookingModal = ({ ride, onClose, onConfirm }: BookingModalProps) => {
  const [seats, setSeats] = useState(1);
  const totalPrice = parseFloat(ride.price) * seats;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#17212B] rounded-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">Confirm Booking</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between text-gray-300">
            <span>From:</span>
            <span className="font-medium">{ride.origin.name}</span>
          </div>
          
          <div className="flex justify-between text-gray-300">
            <span>To:</span>
            <span className="font-medium">{ride.destination.name}</span>
          </div>
          
          <div className="flex justify-between text-gray-300">
            <span>Date:</span>
            <span className="font-medium">
              {new Date(ride.departureTime).toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          <div className="flex justify-between items-center text-gray-300">
            <span>Number of seats:</span>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSeats(Math.max(1, seats - 1))}
                className="w-8 h-8 rounded-full bg-[#2AABEE]/20 hover:bg-[#2AABEE]/30 text-[#2AABEE] flex items-center justify-center"
              >
                -
              </button>
              <span className="w-8 text-center text-white">{seats}</span>
              <button
                onClick={() => setSeats(Math.min(ride.seatsAvailable, seats + 1))}
                className="w-8 h-8 rounded-full bg-[#2AABEE]/20 hover:bg-[#2AABEE]/30 text-[#2AABEE] flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-between text-gray-300">
            <span>Total price:</span>
            <span className="font-bold text-white">
              {totalPrice} {ride.currency}
            </span>
          </div>

          <div className="pt-4 flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(seats)}
              className="flex-1 px-4 py-2 rounded-lg bg-[#2AABEE] hover:bg-[#2AABEE]/80 text-white transition-colors"
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
