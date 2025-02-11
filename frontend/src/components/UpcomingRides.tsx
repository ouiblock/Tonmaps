import { useState, useEffect } from 'react';
import { RideListing } from '../types';

interface UpcomingRidesProps {
  userId: string;
}

export const UpcomingRides = ({ userId }: UpcomingRidesProps) => {
  const [rides, setRides] = useState<RideListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading rides
    setTimeout(() => {
      setRides([
        {
          id: '1',
          driver: 'John Doe',
          origin: { name: 'Paris', lat: 48.8566, lng: 2.3522 },
          destination: { name: 'Lyon', lat: 45.7578, lng: 4.8320 },
          departureTime: Date.now() + 86400000, // tomorrow
          estimatedDuration: 7200, // 2 hours
          price: '45',
          currency: 'EUR',
          seatsAvailable: 3,
          preferences: {
            smoking: false,
            pets: true,
            music: true
          },
          recurring: false
        },
        // Add more rides here
      ]);
      setLoading(false);
    }, 1000);
  }, [userId]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2AABEE] mx-auto"></div>
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        No upcoming rides
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold text-white mb-4">Your Upcoming Rides</h2>
      
      {rides.map((ride) => (
        <div
          key={ride.id}
          className="bg-[#242f3d] rounded-xl p-4 space-y-3"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-lg font-medium text-white">
                {ride.origin.name} → {ride.destination.name}
              </div>
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
            <div className="text-right">
              <div className="text-[#2AABEE] font-bold">
                {ride.price} {ride.currency}
              </div>
              <div className="text-sm text-gray-400">
                {Math.round(ride.estimatedDuration / 3600)} hours
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center">
              <span className="material-icons-outlined text-base mr-1">
                person
              </span>
              {ride.seatsAvailable} seat{ride.seatsAvailable > 1 ? 's' : ''} available
            </div>
            
            {ride.preferences.smoking && (
              <div className="flex items-center">
                <span className="material-icons-outlined text-base mr-1">
                  smoking_rooms
                </span>
                Smoking
              </div>
            )}
            
            {ride.preferences.pets && (
              <div className="flex items-center">
                <span className="material-icons-outlined text-base mr-1">
                  pets
                </span>
                Pets
              </div>
            )}
            
            {ride.preferences.music && (
              <div className="flex items-center">
                <span className="material-icons-outlined text-base mr-1">
                  music_note
                </span>
                Music
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
