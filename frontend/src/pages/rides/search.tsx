import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { mapsService } from '../../services/MapsService';

interface Ride {
  id: string;
  type: 'ride' | 'package' | 'food';
  driver: {
    id: string;
    name: string;
    photo: string;
    rating: number;
    rides: number;
  };
  departure: {
    address: string;
    placeId: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    placeId: string;
    lat: number;
    lng: number;
  };
  date: string;
  time: string;
  seats?: number;
  packageSize?: 'small' | 'medium' | 'large';
  price: number;
  description: string;
  restrictions?: string[];
  confirmationCode?: string;
}

const mockRides: Ride[] = [
  {
    id: '1',
    type: 'ride',
    driver: {
      id: '1',
      name: 'Jean Dupont',
      photo: '👨',
      rating: 4.8,
      rides: 124,
    },
    departure: {
      address: 'Paris, France',
      placeId: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ',
      lat: 48.8566,
      lng: 2.3522,
    },
    destination: {
      address: 'Lyon, France',
      placeId: 'ChIJl4foalHq9EcR8CG75CqrCAQ',
      lat: 45.7578,
      lng: 4.8320,
    },
    date: '2025-02-06',
    time: '09:00',
    seats: 3,
    price: 25,
    description: 'Trajet direct, départ ponctuel',
    restrictions: ['Non-fumeur'],
  },
  {
    id: '2',
    type: 'package',
    driver: {
      id: '2',
      name: 'Marie Martin',
      photo: '👩',
      rating: 4.9,
      rides: 89,
    },
    departure: {
      address: 'Lyon, France',
      placeId: 'ChIJl4foalHq9EcR8CG75CqrCAQ',
      lat: 45.7578,
      lng: 4.8320,
    },
    destination: {
      address: 'Marseille, France',
      placeId: 'ChIJM1PaREO_yRIRIAKX_aUZCAQ',
      lat: 43.2965,
      lng: 5.3698,
    },
    date: '2025-02-06',
    time: '14:00',
    packageSize: 'medium',
    price: 15,
    description: 'Transport de colis sécurisé',
  },
];

export default function SearchRides() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    type: 'ride',
    departure: '',
    destination: '',
    date: '',
  });
  const [filteredRides, setFilteredRides] = useState(mockRides);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSearch = () => {
    // TODO: Implement actual search with backend
    setFilteredRides(mockRides.filter(ride => 
      ride.type === searchParams.type &&
      (!searchParams.date || ride.date === searchParams.date)
    ));
  };

  const handleBook = (ride: Ride) => {
    setSelectedRide(ride);
    setShowConfirmation(true);
  };

  const confirmBooking = () => {
    if (!selectedRide) return;
    
    const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    // TODO: Save booking with confirmation code to backend
    
    setShowConfirmation(false);
    router.push('/rides/bookings');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Form */}
      <div className="bg-white dark:bg-[#2D2D2D] rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040]"
              value={searchParams.type}
              onChange={e => setSearchParams(prev => ({ ...prev, type: e.target.value as any }))}
            >
              <option value="ride">Covoiturage</option>
              <option value="package">Colis</option>
              <option value="food">Nourriture</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Départ</label>
            <input
              type="text"
              placeholder="Ville de départ"
              className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040]"
              value={searchParams.departure}
              onChange={e => setSearchParams(prev => ({ ...prev, departure: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Destination</label>
            <input
              type="text"
              placeholder="Ville d'arrivée"
              className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040]"
              value={searchParams.destination}
              onChange={e => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040]"
              value={searchParams.date}
              onChange={e => setSearchParams(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="w-full mt-4 py-2 bg-[#007AFF] text-white rounded-lg font-medium hover:bg-[#0056B3] transition-colors"
        >
          Rechercher
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredRides.map(ride => (
          <div
            key={ride.id}
            className="bg-white dark:bg-[#2D2D2D] rounded-lg shadow-lg p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <span className="text-3xl">{ride.driver.photo}</span>
                  <div className="mt-2 text-center">
                    <div className="font-medium">{ride.driver.name}</div>
                    <div className="text-sm text-[#717171] dark:text-[#B3B3B3]">
                      ⭐ {ride.driver.rating} ({ride.driver.rides})
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {ride.type === 'ride' ? '🚗' : ride.type === 'package' ? '📦' : '🍽️'}
                    </span>
                    <span className="font-medium">
                      {ride.type === 'ride' ? 'Covoiturage' : ride.type === 'package' ? 'Colis' : 'Nourriture'}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p>
                      <span className="font-medium">Départ:</span> {ride.departure.address}
                    </p>
                    <p>
                      <span className="font-medium">Arrivée:</span> {ride.destination.address}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span> {ride.date} à {ride.time}
                    </p>
                    {ride.seats && (
                      <p>
                        <span className="font-medium">Places:</span> {ride.seats}
                      </p>
                    )}
                    {ride.packageSize && (
                      <p>
                        <span className="font-medium">Taille:</span> {ride.packageSize}
                      </p>
                    )}
                  </div>
                  {ride.restrictions && ride.restrictions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {ride.restrictions.map(restriction => (
                        <span
                          key={restriction}
                          className="px-2 py-1 text-xs rounded-full bg-[#FF8C42]/10 text-[#FF8C42]"
                        >
                          {restriction}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-medium">{ride.price}€</div>
                <button
                  onClick={() => handleBook(ride)}
                  className="mt-4 px-6 py-2 bg-[#007AFF] text-white rounded-lg font-medium hover:bg-[#0056B3] transition-colors"
                >
                  Réserver
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedRide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-[#2D2D2D] rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Confirmer la réservation</h2>
            <div className="space-y-4">
              <p>
                <span className="font-medium">Type:</span>{' '}
                {selectedRide.type === 'ride' ? 'Covoiturage' : selectedRide.type === 'package' ? 'Colis' : 'Nourriture'}
              </p>
              <p>
                <span className="font-medium">Trajet:</span>{' '}
                {selectedRide.departure.address} → {selectedRide.destination.address}
              </p>
              <p>
                <span className="font-medium">Date:</span>{' '}
                {selectedRide.date} à {selectedRide.time}
              </p>
              <p>
                <span className="font-medium">Prix:</span> {selectedRide.price}€
              </p>
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-2 border border-[#E0E0E0] dark:border-[#404040] rounded-lg font-medium"
              >
                Annuler
              </button>
              <button
                onClick={confirmBooking}
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
