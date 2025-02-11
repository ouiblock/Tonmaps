import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Reservation {
  id: string;
  type: 'ride' | 'parcel';
  from: string;
  to: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  counterparty: {
    name: string;
    rating: number;
  };
}

interface ReservationsListProps {
  reservations: Reservation[];
}

const ReservationsList: React.FC<ReservationsListProps> = ({ reservations }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'confirmed':
        return '✅';
      case 'completed':
        return '🎉';
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <div
          key={reservation.id}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {reservation.type === 'ride' ? '🚗' : '📦'}
                </span>
                <h3 className="text-lg font-semibold text-gray-900">
                  {reservation.from} → {reservation.to}
                </h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formatDistanceToNow(new Date(reservation.date), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  reservation.status
                )}`}
              >
                {getStatusIcon(reservation.status)} {reservation.status}
              </span>
              <p className="text-lg font-bold text-blue-600 mt-1">
                {reservation.amount} TON
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold">
                  {reservation.counterparty.name.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {reservation.counterparty.name}
                </p>
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600 ml-1">
                    {reservation.counterparty.rating}
                  </span>
                </div>
              </div>
            </div>

            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationsList;
