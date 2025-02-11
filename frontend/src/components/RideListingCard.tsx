import { useState } from 'react';
import { RideListing, User } from '../types';
import { BookingModal } from './booking/BookingModal';
import { PaymentModal } from './booking/PaymentModal';

interface RideListingCardProps {
  ride: RideListing;
  driver: User;
  onClick?: () => void;
}

const RideListingCard = ({ ride, driver, onClick }: RideListingCardProps) => {
  const [showBooking, setShowBooking] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState(1);

  const handleBook = (seats: number) => {
    setSelectedSeats(seats);
    setShowBooking(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    // TODO: Update ride status in backend
    alert('Booking confirmed!');
  };

  return (
    <>
      <div
        onClick={onClick}
        className="bg-[#242F3D] rounded-xl border-2 border-[#17212B] hover:border-[#2AABEE] hover:bg-[#2AABEE]/5 transition-all cursor-pointer p-4 space-y-4"
      >
        {/* Driver Info */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={driver.avatarUrl || 'https://via.placeholder.com/40'}
              alt={driver.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
            {driver.verificationLevel > 0 && (
              <div className="absolute -bottom-1 -right-1 bg-[#2AABEE] rounded-full p-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-medium text-white">{driver.displayName}</span>
              <span className="text-sm text-gray-400">@{driver.telegramUsername}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>⭐ {driver.rating.toFixed(1)}</span>
              <span>•</span>
              <span>{driver.totalRides} rides</span>
            </div>
          </div>
        </div>

        {/* Journey Details */}
        <div className="flex items-start space-x-3">
          <div className="flex flex-col items-center space-y-1 pt-1">
            <div className="w-3 h-3 rounded-full bg-[#2AABEE]" />
            <div className="w-0.5 h-8 bg-gray-600" />
            <div className="w-3 h-3 rounded-full border-2 border-[#2AABEE]" />
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <div className="font-medium text-white">{ride.origin.name}</div>
              <div className="text-sm text-gray-400">
                {new Date(ride.departureTime).toLocaleDateString('en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div>
              <div className="font-medium text-white">{ride.destination.name}</div>
              <div className="text-sm text-gray-400">~{Math.round(ride.estimatedDuration / 3600)} hours</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium text-[#2AABEE]">
              {ride.price} {ride.currency}
            </div>
            <div className="text-sm text-gray-400">{ride.seatsAvailable} seats left</div>
          </div>
        </div>

        {/* Preferences */}
        <div className="flex items-center space-x-3 text-sm text-gray-400">
          {ride.preferences.smoking && (
            <div className="flex items-center space-x-1">
              <span>🚬</span>
              <span>Smoking</span>
            </div>
          )}
          {ride.preferences.pets && (
            <div className="flex items-center space-x-1">
              <span>🐾</span>
              <span>Pets</span>
            </div>
          )}
          {ride.preferences.music && (
            <div className="flex items-center space-x-1">
              <span>🎵</span>
              <span>Music</span>
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowBooking(true);
          }}
          className="w-full mt-2 px-4 py-2 rounded-lg bg-[#2AABEE] hover:bg-[#2AABEE]/80 text-white transition-colors"
        >
          Book Now
        </button>

        {showBooking && (
          <BookingModal
            ride={ride}
            onClose={() => setShowBooking(false)}
            onConfirm={handleBook}
          />
        )}

        {showPayment && (
          <PaymentModal
            ride={ride}
            seats={selectedSeats}
            onClose={() => setShowPayment(false)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </>
  );
};

export default RideListingCard;
