import { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Ride, Location } from '../types';

interface RideShareProps {
  userLocation: Location | null;
}

const RideShare = ({ userLocation }: RideShareProps) => {
  const { address, userScore } = useWallet();
  const [isDriver, setIsDriver] = useState(false);
  const [destination, setDestination] = useState<Location | null>(null);
  const [price, setPrice] = useState('');
  const [activeRides, setActiveRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      // Here we would fetch active rides from the blockchain or backend
      // For now, using mock data
      setActiveRides([
        {
          id: '1',
          driver: address,
          pickup: userLocation || { lat: 0, lng: 0 },
          destination: { lat: 1, lng: 1 },
          status: 'pending',
          price: '10',
          timestamp: Date.now(),
          paymentStatus: 'pending'
        }
      ]);
    }
  }, [address, userLocation]);

  const createRide = async () => {
    if (!address || !userLocation || !destination) return;
    
    setLoading(true);
    setError(null);

    try {
      const newRide: Ride = {
        id: Date.now().toString(),
        driver: address,
        pickup: userLocation,
        destination,
        status: 'pending',
        price,
        timestamp: Date.now(),
        paymentStatus: 'pending'
      };

      // Here we would send the ride to the blockchain or backend
      setActiveRides(prev => [...prev, newRide]);
    } catch (err) {
      console.error('Error creating ride:', err);
      setError('Failed to create ride');
    } finally {
      setLoading(false);
    }
  };

  const acceptRide = async (rideId: string) => {
    if (!address) return;
    
    setLoading(true);
    setError(null);

    try {
      // Here we would update the ride on the blockchain or backend
      setActiveRides(prev =>
        prev.map(ride =>
          ride.id === rideId
            ? { ...ride, passenger: address, status: 'accepted' }
            : ride
        )
      );
    } catch (err) {
      console.error('Error accepting ride:', err);
      setError('Failed to accept ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Ride Sharing</h2>
        <p className="text-sm text-gray-600">Your Score: {userScore} TMAPS</p>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isDriver}
            onChange={(e) => setIsDriver(e.target.checked)}
            className="mr-2"
          />
          I want to be a driver
        </label>
      </div>

      {isDriver ? (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Price in TON"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={createRide}
            disabled={loading || !destination}
            className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Ride'}
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <h3 className="font-bold mb-2">Available Rides</h3>
          {activeRides.map(ride => (
            <div key={ride.id} className="border p-2 rounded mb-2">
              <p>Price: {ride.price} TON</p>
              <p>Status: {ride.status}</p>
              {ride.status === 'pending' && (
                <button
                  onClick={() => acceptRide(ride.id)}
                  disabled={loading}
                  className="mt-2 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                  Accept Ride
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-red-500 mt-2">{error}</div>
      )}
    </div>
  );
};

export default RideShare;
