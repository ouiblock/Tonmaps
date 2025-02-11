import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import ReservationsList from '@/components/marketplace/ReservationsList';

// Example data - In a real app, this would come from an API
const exampleReservations = [
  {
    id: '1',
    type: 'ride' as const,
    from: 'Paris',
    to: 'Lyon',
    date: new Date('2025-02-12T10:00:00'),
    status: 'confirmed' as const,
    amount: 50,
    counterparty: {
      name: 'Jean Dupont',
      rating: 4.8,
    },
  },
  {
    id: '2',
    type: 'parcel' as const,
    from: 'Marseille',
    to: 'Nice',
    date: new Date('2025-02-12T14:00:00'),
    status: 'pending' as const,
    amount: 35,
    counterparty: {
      name: 'Pierre Dubois',
      rating: 4.6,
    },
  },
];

const ReservationsPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <>
      <Head>
        <title>My Reservations - Onzrod</title>
        <meta
          name="description"
          content="View your upcoming and past rides and deliveries on Onzrod"
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Reservations</h1>
            <p className="mt-2 text-gray-600">
              Manage your upcoming and past rides and deliveries
            </p>
          </div>

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`${
                    activeTab === 'upcoming'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`${
                    activeTab === 'past'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  Past
                </button>
              </nav>
            </div>
          </div>

          <ReservationsList
            reservations={
              activeTab === 'upcoming'
                ? exampleReservations.filter(
                    (r) => r.status === 'pending' || r.status === 'confirmed'
                  )
                : exampleReservations.filter(
                    (r) => r.status === 'completed' || r.status === 'cancelled'
                  )
            }
          />
        </div>
      </div>
    </>
  );
};

export default ReservationsPage;
