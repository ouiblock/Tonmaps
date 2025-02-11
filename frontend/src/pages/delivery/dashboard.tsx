import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Delivery {
  id: string;
  type: 'food' | 'package';
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered';
  pickup: {
    address: string;
    placeId: string;
    lat: number;
    lng: number;
    contact: string;
    phone: string;
  };
  dropoff: {
    address: string;
    placeId: string;
    lat: number;
    lng: number;
    contact: string;
    phone: string;
  };
  timeWindow: {
    start: string;
    end: string;
  };
  price: number;
  distance: number;
  duration: number;
  confirmationCode?: string;
  packageDetails?: {
    size: 'small' | 'medium' | 'large';
    weight: number;
    description: string;
  };
  foodDetails?: {
    restaurant: string;
    items: Array<{
      name: string;
      quantity: number;
      special: string;
    }>;
  };
}

const mockDeliveries: Delivery[] = [
  {
    id: '1',
    type: 'food',
    status: 'pending',
    pickup: {
      address: 'Pizza Palace, 123 Rue de la Paix, Paris',
      placeId: 'ChIJ...',
      lat: 48.8566,
      lng: 2.3522,
      contact: 'Pizza Palace',
      phone: '+33123456789',
    },
    dropoff: {
      address: '456 Avenue des Champs-Élysées, Paris',
      placeId: 'ChIJ...',
      lat: 48.8738,
      lng: 2.2950,
      contact: 'Jean Dupont',
      phone: '+33987654321',
    },
    timeWindow: {
      start: '2025-02-05T19:00:00',
      end: '2025-02-05T19:30:00',
    },
    price: 8.50,
    distance: 3.2,
    duration: 15,
    foodDetails: {
      restaurant: 'Pizza Palace',
      items: [
        { name: 'Margherita', quantity: 1, special: 'Extra fromage' },
        { name: 'Coca-Cola', quantity: 2, special: '' },
      ],
    },
  },
  {
    id: '2',
    type: 'package',
    status: 'accepted',
    pickup: {
      address: 'Point Relais, 789 Rue de Rivoli, Paris',
      placeId: 'ChIJ...',
      lat: 48.8624,
      lng: 2.3385,
      contact: 'Point Relais',
      phone: '+33123456789',
    },
    dropoff: {
      address: '101 Boulevard Haussmann, Paris',
      placeId: 'ChIJ...',
      lat: 48.8737,
      lng: 2.3317,
      contact: 'Marie Martin',
      phone: '+33987654321',
    },
    timeWindow: {
      start: '2025-02-05T14:00:00',
      end: '2025-02-05T18:00:00',
    },
    price: 12.00,
    distance: 1.8,
    duration: 10,
    confirmationCode: 'XYZ123',
    packageDetails: {
      size: 'medium',
      weight: 5.2,
      description: 'Colis fragile',
    },
  },
];

export default function DeliveryDashboard() {
  const [deliveries, setDeliveries] = useState(mockDeliveries);
  const [activeDelivery, setActiveDelivery] = useState<Delivery | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const router = useRouter();

  const handleAcceptDelivery = (delivery: Delivery) => {
    setDeliveries(prev =>
      prev.map(d =>
        d.id === delivery.id
          ? { ...d, status: 'accepted' as const }
          : d
      )
    );
  };

  const handleStartDelivery = (delivery: Delivery) => {
    setActiveDelivery(delivery);
    // TODO: Start navigation to pickup location
  };

  const handleConfirmPickup = () => {
    if (!activeDelivery) return;
    
    setDeliveries(prev =>
      prev.map(d =>
        d.id === activeDelivery.id
          ? { ...d, status: 'picked_up' as const }
          : d
      )
    );
    // TODO: Start navigation to dropoff location
  };

  const handleConfirmDelivery = () => {
    if (!activeDelivery || !confirmationCode) return;
    
    if (confirmationCode === activeDelivery.confirmationCode) {
      setDeliveries(prev =>
        prev.map(d =>
          d.id === activeDelivery.id
            ? { ...d, status: 'delivered' as const }
            : d
        )
      );
      setShowConfirmation(false);
      setConfirmationCode('');
      setActiveDelivery(null);
    } else {
      alert('Code de confirmation incorrect');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Available Deliveries */}
        <div className="lg:w-2/3 space-y-6">
          <h2 className="text-xl font-bold">Livraisons disponibles</h2>
          {deliveries
            .filter(d => d.status === 'pending')
            .map(delivery => (
              <div
                key={delivery.id}
                className="bg-white dark:bg-[#2D2D2D] rounded-lg shadow-lg p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {delivery.type === 'food' ? '🍽️' : '📦'}
                      </span>
                      <span className="font-medium">
                        {delivery.type === 'food' ? 'Livraison repas' : 'Livraison colis'}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <p>
                        <span className="font-medium">Pickup:</span> {delivery.pickup.address}
                      </p>
                      <p>
                        <span className="font-medium">Dropoff:</span> {delivery.dropoff.address}
                      </p>
                      <p>
                        <span className="font-medium">Distance:</span> {delivery.distance} km
                      </p>
                      <p>
                        <span className="font-medium">Durée estimée:</span> {delivery.duration} min
                      </p>
                      <p>
                        <span className="font-medium">Créneau:</span>{' '}
                        {new Date(delivery.timeWindow.start).toLocaleTimeString()} -{' '}
                        {new Date(delivery.timeWindow.end).toLocaleTimeString()}
                      </p>
                    </div>
                    {delivery.foodDetails && (
                      <div className="mt-4">
                        <p className="font-medium">Commande:</p>
                        <ul className="mt-2 space-y-1">
                          {delivery.foodDetails.items.map((item, index) => (
                            <li key={index}>
                              {item.quantity}x {item.name}
                              {item.special && <span className="text-sm text-[#717171]"> ({item.special})</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {delivery.packageDetails && (
                      <div className="mt-4">
                        <p className="font-medium">Détails du colis:</p>
                        <p className="mt-2">
                          Taille: {delivery.packageDetails.size}, Poids: {delivery.packageDetails.weight} kg
                        </p>
                        <p className="text-sm text-[#717171]">{delivery.packageDetails.description}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-medium">{delivery.price}€</div>
                    <button
                      onClick={() => handleAcceptDelivery(delivery)}
                      className="mt-4 px-6 py-2 bg-[#007AFF] text-white rounded-lg font-medium hover:bg-[#0056B3] transition-colors"
                    >
                      Accepter
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Active Delivery */}
        <div className="lg:w-1/3 space-y-6">
          <h2 className="text-xl font-bold">Livraison en cours</h2>
          {activeDelivery ? (
            <div className="bg-white dark:bg-[#2D2D2D] rounded-lg shadow-lg p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {activeDelivery.type === 'food' ? '🍽️' : '📦'}
                  </span>
                  <span className="font-medium">
                    {activeDelivery.type === 'food' ? 'Livraison repas' : 'Livraison colis'}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Étape actuelle:</p>
                  {activeDelivery.status === 'accepted' ? (
                    <>
                      <p>En route vers le point de collecte</p>
                      <div>
                        <p className="font-medium">Contact:</p>
                        <p>{activeDelivery.pickup.contact}</p>
                        <p>{activeDelivery.pickup.phone}</p>
                      </div>
                      <button
                        onClick={handleConfirmPickup}
                        className="w-full mt-4 py-2 bg-[#007AFF] text-white rounded-lg font-medium hover:bg-[#0056B3] transition-colors"
                      >
                        Confirmer la collecte
                      </button>
                    </>
                  ) : (
                    <>
                      <p>En route vers la destination</p>
                      <div>
                        <p className="font-medium">Contact:</p>
                        <p>{activeDelivery.dropoff.contact}</p>
                        <p>{activeDelivery.dropoff.phone}</p>
                      </div>
                      <button
                        onClick={() => setShowConfirmation(true)}
                        className="w-full mt-4 py-2 bg-[#007AFF] text-white rounded-lg font-medium hover:bg-[#0056B3] transition-colors"
                      >
                        Confirmer la livraison
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[#717171] dark:text-[#B3B3B3]">Aucune livraison en cours</p>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-[#2D2D2D] rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Confirmer la livraison</h2>
            <p className="mb-4">
              Demandez le code de confirmation au destinataire pour finaliser la livraison.
            </p>
            <input
              type="text"
              placeholder="Code de confirmation"
              className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040]"
              value={confirmationCode}
              onChange={e => setConfirmationCode(e.target.value.toUpperCase())}
            />
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-2 border border-[#E0E0E0] dark:border-[#404040] rounded-lg font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelivery}
                className="flex-1 py-2 bg-[#007AFF] text-white rounded-lg font-medium hover:bg-[#0056B3] transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
