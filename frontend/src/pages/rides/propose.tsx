import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { mapsService } from '../../services/MapsService';

interface RideProposal {
  type: 'ride' | 'package' | 'food';
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
}

export default function ProposeRide() {
  const router = useRouter();
  const [proposal, setProposal] = useState<RideProposal>({
    type: 'ride',
    departure: {
      address: '',
      placeId: '',
      lat: 0,
      lng: 0,
    },
    destination: {
      address: '',
      placeId: '',
      lat: 0,
      lng: 0,
    },
    date: '',
    time: '',
    seats: 4,
    price: 0,
    description: '',
  });

  const generateConfirmationCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmationCode = generateConfirmationCode();
    // TODO: Save to backend with confirmation code
    router.push('/rides/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Proposer un trajet</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Type de trajet</label>
          <div className="grid grid-cols-3 gap-4">
            {['ride', 'package', 'food'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setProposal(prev => ({ ...prev, type: type as RideProposal['type'] }))}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  proposal.type === type
                    ? 'border-[#007AFF] bg-[#007AFF]/5'
                    : 'border-[#E0E0E0] dark:border-[#404040]'
                }`}
              >
                <span className="text-2xl mb-2 block">
                  {type === 'ride' ? '🚗' : type === 'package' ? '📦' : '🍽️'}
                </span>
                <span className="font-medium">
                  {type === 'ride' ? 'Covoiturage' : type === 'package' ? 'Colis' : 'Nourriture'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Départ</label>
            <input
              type="text"
              placeholder="Adresse de départ"
              className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Destination</label>
            <input
              type="text"
              placeholder="Adresse de destination"
              className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040]"
              required
            />
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040]"
              required
              min={new Date().toISOString().split('T')[0]}
              value={proposal.date}
              onChange={e => setProposal(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Heure</label>
            <input
              type="time"
              className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040]"
              required
              value={proposal.time}
              onChange={e => setProposal(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>
        </div>

        {/* Type-specific fields */}
        {proposal.type === 'ride' && (
          <div>
            <label className="block text-sm font-medium mb-2">Places disponibles</label>
            <input
              type="number"
              min="1"
              max="8"
              className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040]"
              value={proposal.seats}
              onChange={e => setProposal(prev => ({ ...prev, seats: parseInt(e.target.value) }))}
              required
            />
          </div>
        )}

        {proposal.type === 'package' && (
          <div>
            <label className="block text-sm font-medium mb-2">Taille du colis</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040]"
              value={proposal.packageSize}
              onChange={e => setProposal(prev => ({ ...prev, packageSize: e.target.value as any }))}
              required
            >
              <option value="small">Petit (sac à main)</option>
              <option value="medium">Moyen (valise cabine)</option>
              <option value="large">Grand (grande valise)</option>
            </select>
          </div>
        )}

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-2">Prix (€)</label>
          <input
            type="number"
            min="0"
            step="0.5"
            className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040]"
            value={proposal.price}
            onChange={e => setProposal(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040]"
            rows={4}
            value={proposal.description}
            onChange={e => setProposal(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Informations supplémentaires..."
            required
          />
        </div>

        {/* Restrictions */}
        <div>
          <label className="block text-sm font-medium mb-2">Restrictions</label>
          <div className="space-y-2">
            {['Non-fumeur', 'Pas d\'animaux', 'Bagage léger uniquement'].map(restriction => (
              <label key={restriction} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-[#E0E0E0] dark:border-[#404040]"
                  onChange={e => {
                    setProposal(prev => ({
                      ...prev,
                      restrictions: e.target.checked
                        ? [...(prev.restrictions || []), restriction]
                        : (prev.restrictions || []).filter(r => r !== restriction),
                    }));
                  }}
                />
                <span>{restriction}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#007AFF] text-white rounded-lg font-medium hover:bg-[#0056B3] transition-colors"
        >
          Publier le trajet
        </button>
      </form>
    </div>
  );
}
