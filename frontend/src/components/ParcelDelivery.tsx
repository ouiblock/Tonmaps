import { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Delivery, Location } from '../types';

interface ParcelDeliveryProps {
  userLocation: Location | null;
}

const ParcelDelivery = ({ userLocation }: ParcelDeliveryProps) => {
  const { address, userScore } = useWallet();
  const [isSender, setIsSender] = useState(false);
  const [destination, setDestination] = useState<Location | null>(null);
  const [price, setPrice] = useState('');
  const [parcelSize, setParcelSize] = useState<'small' | 'medium' | 'large'>('small');
  const [weight, setWeight] = useState(0);
  const [activeDeliveries, setActiveDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      // Here we would fetch active deliveries from the blockchain or backend
      // For now, using mock data
      setActiveDeliveries([
        {
          id: '1',
          sender: address,
          pickup: userLocation || { lat: 0, lng: 0 },
          destination: { lat: 1, lng: 1 },
          status: 'pending',
          price: '5',
          timestamp: Date.now(),
          paymentStatus: 'pending',
          parcelSize: 'small',
          weight: 1
        }
      ]);
    }
  }, [address, userLocation]);

  const createDelivery = async () => {
    if (!address || !userLocation || !destination) return;
    
    setLoading(true);
    setError(null);

    try {
      const newDelivery: Delivery = {
        id: Date.now().toString(),
        sender: address,
        pickup: userLocation,
        destination,
        status: 'pending',
        price,
        timestamp: Date.now(),
        paymentStatus: 'pending',
        parcelSize,
        weight
      };

      // Here we would send the delivery to the blockchain or backend
      setActiveDeliveries(prev => [...prev, newDelivery]);
    } catch (err) {
      console.error('Error creating delivery:', err);
      setError('Failed to create delivery request');
    } finally {
      setLoading(false);
    }
  };

  const acceptDelivery = async (deliveryId: string) => {
    if (!address) return;
    
    setLoading(true);
    setError(null);

    try {
      // Here we would update the delivery on the blockchain or backend
      setActiveDeliveries(prev =>
        prev.map(delivery =>
          delivery.id === deliveryId
            ? { ...delivery, courier: address, status: 'accepted' }
            : delivery
        )
      );
    } catch (err) {
      console.error('Error accepting delivery:', err);
      setError('Failed to accept delivery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Parcel Delivery</h2>
        <p className="text-sm text-gray-600">Your Score: {userScore} TMAPS</p>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isSender}
            onChange={(e) => setIsSender(e.target.checked)}
            className="mr-2"
          />
          I want to send a parcel
        </label>
      </div>

      {isSender ? (
        <div className="mb-4">
          <select
            value={parcelSize}
            onChange={(e) => setParcelSize(e.target.value as 'small' | 'medium' | 'large')}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>

          <input
            type="number"
            placeholder="Weight in kg"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full p-2 border rounded mb-2"
          />

          <input
            type="text"
            placeholder="Price in TON"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />

          <button
            onClick={createDelivery}
            disabled={loading || !destination}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Delivery Request'}
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <h3 className="font-bold mb-2">Available Deliveries</h3>
          {activeDeliveries.map(delivery => (
            <div key={delivery.id} className="border p-2 rounded mb-2">
              <p>Price: {delivery.price} TON</p>
              <p>Size: {delivery.parcelSize}</p>
              <p>Weight: {delivery.weight}kg</p>
              <p>Status: {delivery.status}</p>
              {delivery.status === 'pending' && (
                <button
                  onClick={() => acceptDelivery(delivery.id)}
                  disabled={loading}
                  className="mt-2 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                  Accept Delivery
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

export default ParcelDelivery;
