import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import RideCard from '@/components/marketplace/RideCard';
import ParcelCard from '@/components/marketplace/ParcelCard';
import { useWallet } from '@/contexts/WalletContext';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/solid';

// Example data - In a real app, this would come from an API
const exampleRides = [
  {
    id: '1',
    from: 'Paris',
    to: 'Lyon',
    date: new Date('2025-02-12T10:00:00'),
    price: 50,
    seats: 3,
    driver: {
      name: 'Jean Dupont',
      rating: 4.8,
      completedRides: 124,
    },
  },
  {
    id: '2',
    from: 'Marseille',
    to: 'Nice',
    date: new Date('2025-02-12T14:00:00'),
    price: 30,
    seats: 2,
    driver: {
      name: 'Marie Martin',
      rating: 4.9,
      completedRides: 89,
    },
  },
];

const exampleParcels = [
  {
    id: '1',
    from: 'Paris',
    to: 'Lyon',
    deadline: new Date('2025-02-12T18:00:00'),
    reward: 20,
    size: 'small' as const,
    weight: 2,
    sender: {
      name: 'Sophie Bernard',
      rating: 4.7,
      completedDeliveries: 45,
    },
  },
  {
    id: '2',
    from: 'Marseille',
    to: 'Nice',
    deadline: new Date('2025-02-12T20:00:00'),
    reward: 35,
    size: 'medium' as const,
    weight: 5,
    sender: {
      name: 'Pierre Dubois',
      rating: 4.6,
      completedDeliveries: 23,
    },
  },
];

const MarketplacePage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<'rides' | 'parcels'>('rides');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { address } = useWallet();

  const handleRideSelect = (rideId: string) => {
    setSelectedItem(rideId);
    // In a real app, this would open a booking modal or navigate to a booking page
    console.log('Selected ride:', rideId);
  };

  const handleParcelSelect = (parcelId: string) => {
    setSelectedItem(parcelId);
    // In a real app, this would open a delivery acceptance modal
    console.log('Selected parcel:', parcelId);
  };

  return (
    <>
      <Head>
        <title>Marketplace - Onzrod</title>
        <meta name="description" content="Find rides and delivery opportunities on Onzrod" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
                <p className="mt-2 text-gray-600">Find rides and delivery opportunities</p>
              </div>
              {activeTab === 'rides' ? (
                <Link
                  href="/rides/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Offer a Ride
                </Link>
              ) : (
                <Link
                  href="/parcels/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Delivery Request
                </Link>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('rides')}
                  className={`${
                    activeTab === 'rides'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  Available Rides
                </button>
                <button
                  onClick={() => setActiveTab('parcels')}
                  className={`${
                    activeTab === 'parcels'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  Delivery Requests
                </button>
              </nav>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'rides' ? (
              exampleRides.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  onSelect={handleRideSelect}
                />
              ))
            ) : (
              exampleParcels.map((parcel) => (
                <ParcelCard
                  key={parcel.id}
                  parcel={parcel}
                  onSelect={handleParcelSelect}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketplacePage;
