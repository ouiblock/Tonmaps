// @ts-nocheck

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  id: string;
  type: 'food' | 'package';
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered';
  createdAt: string;
  total: number;
  items?: {
    name: string;
    quantity: number;
    price: number;
  }[];
  pickup: {
    address: string;
    time: string;
  };
  dropoff: {
    address: string;
    time: string;
  };
  confirmationCode: string;
}

interface DeliveryMetrics {
  totalDeliveries: number;
  totalEarnings: number;
  rating: number;
  completionRate: number;
}

interface RestaurantMetrics {
  totalOrders: number;
  totalRevenue: number;
  rating: number;
  averagePreparationTime: number;
}

interface UserMetrics {
  totalOrders: number;
  totalSpent: number;
  favoriteRestaurants: string[];
  savedAddresses: string[];
}

const DashboardContent = dynamic(() => import('../components/DashboardContent'), {
  ssr: false,
});

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('current');
  const [userType, setUserType] = useState<'driver' | 'restaurant' | 'user'>('user');
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<DeliveryMetrics | RestaurantMetrics | UserMetrics | null>(null);

  useEffect(() => {
    // TODO: Get user type from backend
    // For now, using mock data
    const mockOrders: Order[] = [
      {
        id: '1',
        type: 'food',
        status: 'pending',
        createdAt: '2025-02-06T08:00:00',
        total: 25.99,
        items: [
          { name: 'Burger', quantity: 2, price: 12.99 },
          { name: 'Fries', quantity: 1, price: 4.99 },
        ],
        pickup: {
          address: '123 Restaurant St',
          time: '2025-02-06T08:30:00',
        },
        dropoff: {
          address: '456 Customer Ave',
          time: '2025-02-06T09:00:00',
        },
        confirmationCode: 'ABC123',
      },
    ];
    setOrders(mockOrders);

    // Mock metrics based on user type
    if (userType === 'driver') {
      setMetrics({
        totalDeliveries: 156,
        totalEarnings: 1234.50,
        rating: 4.8,
        completionRate: 98,
      } as DeliveryMetrics);
    } else if (userType === 'restaurant') {
      setMetrics({
        totalOrders: 789,
        totalRevenue: 15678.90,
        rating: 4.6,
        averagePreparationTime: 18,
      } as RestaurantMetrics);
    } else {
      setMetrics({
        totalOrders: 45,
        totalSpent: 789.50,
        favoriteRestaurants: ['Burger House', 'Pizza Palace'],
        savedAddresses: ['Home', 'Work'],
      } as UserMetrics);
    }
  }, [userType]);

  const renderMetrics = () => {
    if (!metrics) return null;

    if (userType === 'driver') {
      const m = metrics as DeliveryMetrics;
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#2D2D2D] rounded-lg p-4">
            <h3 className="text-sm text-[#717171] dark:text-[#B3B3B3]">Livraisons totales</h3>
            <p className="text-2xl font-bold mt-1">{m.totalDeliveries}</p>
          </div>
          <div className="bg-white dark:bg-[#2D2D2D] rounded-lg p-4">
            <h3 className="text-sm text-[#717171] dark:text-[#B3B3B3]">Gains totaux</h3>
            <p className="text-2xl font-bold mt-1">{m.totalEarnings.toFixed(2)}€</p>
          </div>
          <div className="bg-white dark:bg-[#2D2D2D] rounded-lg p-4">
            <h3 className="text-sm text-[#717171] dark:text-[#B3B3B3]">Note moyenne</h3>
            <p className="text-2xl font-bold mt-1">⭐ {m.rating}</p>
          </div>
          <div className="bg-white dark:bg-[#2D2D2D] rounded-lg p-4">
            <h3 className="text-sm text-[#717171] dark:text-[#B3B3B3]">Taux de complétion</h3>
            <p className="text-2xl font-bold mt-1">{m.completionRate}%</p>
          </div>
        </div>
      );
    }

    if (userType === 'restaurant') {
      const m = metrics as RestaurantMetrics;
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#2D2D2D] rounded-lg p-4">
            <h3 className="text-sm text-[#717171] dark:text-[#B3B3B3]">Commandes totales</h3>
            <p className="text-2xl font-bold mt-1">{m.totalOrders}</p>
          </div>
          <div className="bg-white dark:bg-[#2D2D2D] rounded-lg p-4">
            <h3 className="text-sm text-[#717171] dark:text-[#B3B3B3]">Revenus totaux</h3>
            <p className="text-2xl font-bold mt-1">{m.totalRevenue.toFixed(2)}€</p>
          </div>
          <div className="bg-white dark:bg-[#2D2D2D] rounded-lg p-4">
            <h3 className="text-sm text-[#717171] dark:text-[#B3B3B3]">Note moyenne</h3>
            <p className="text-2xl font-bold mt-1">⭐ {m.rating}</p>
          </div>
          <div className="bg-white dark:bg-[#2D2D2D] rounded-lg p-4">
            <h3 className="text-sm text-[#717171] dark:text-[#B3B3B3]">Temps de préparation moyen</h3>
            <p className="text-2xl font-bold mt-1">{m.averagePreparationTime} min</p>
          </div>
        </div>
      );
    }

    const m = metrics as UserMetrics;
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#2D2D2D] rounded-lg p-4">
          <h3 className="text-sm text-[#717171] dark:text-[#B3B3B3]">Commandes totales</h3>
          <p className="text-2xl font-bold mt-1">{m.totalOrders}</p>
        </div>
        <div className="bg-white dark:bg-[#2D2D2D] rounded-lg p-4">
          <h3 className="text-sm text-[#717171] dark:text-[#B3B3B3]">Dépenses totales</h3>
          <p className="text-2xl font-bold mt-1">{m.totalSpent.toFixed(2)}€</p>
        </div>
        <div className="bg-white dark:bg-[#2D2D2D] rounded-lg p-4">
          <h3 className="text-sm text-[#717171] dark:text-[#B3B3B3]">Restaurants favoris</h3>
          <div className="mt-1 space-y-1">
            {m.favoriteRestaurants.map(restaurant => (
              <p key={restaurant} className="text-sm">{restaurant}</p>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-[#2D2D2D] rounded-lg p-4">
          <h3 className="text-sm text-[#717171] dark:text-[#B3B3B3]">Adresses enregistrées</h3>
          <div className="mt-1 space-y-1">
            {m.savedAddresses.map(address => (
              <p key={address} className="text-sm">{address}</p>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderQuickActions = () => {
    if (userType === 'driver') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/delivery/available')}
            className="p-4 bg-white dark:bg-[#2D2D2D] rounded-lg hover:shadow-lg transition-shadow text-left"
          >
            <span className="text-2xl mb-2 block">🚗</span>
            <h3 className="font-medium">Voir les livraisons disponibles</h3>
            <p className="text-sm text-[#717171] dark:text-[#B3B3B3] mt-1">
              Parcourez les commandes à proximité
            </p>
          </button>
          <button
            onClick={() => router.push('/delivery/schedule')}
            className="p-4 bg-white dark:bg-[#2D2D2D] rounded-lg hover:shadow-lg transition-shadow text-left"
          >
            <span className="text-2xl mb-2 block">📅</span>
            <h3 className="font-medium">Gérer mon planning</h3>
            <p className="text-sm text-[#717171] dark:text-[#B3B3B3] mt-1">
              Définissez vos horaires de disponibilité
            </p>
          </button>
          <button
            onClick={() => router.push('/delivery/earnings')}
            className="p-4 bg-white dark:bg-[#2D2D2D] rounded-lg hover:shadow-lg transition-shadow text-left"
          >
            <span className="text-2xl mb-2 block">💰</span>
            <h3 className="font-medium">Mes gains</h3>
            <p className="text-sm text-[#717171] dark:text-[#B3B3B3] mt-1">
              Consultez vos revenus et statistiques
            </p>
          </button>
        </div>
      );
    }

    if (userType === 'restaurant') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/restaurant/menu')}
            className="p-4 bg-white dark:bg-[#2D2D2D] rounded-lg hover:shadow-lg transition-shadow text-left"
          >
            <span className="text-2xl mb-2 block">📝</span>
            <h3 className="font-medium">Gérer le menu</h3>
            <p className="text-sm text-[#717171] dark:text-[#B3B3B3] mt-1">
              Modifiez vos plats et prix
            </p>
          </button>
          <button
            onClick={() => router.push('/restaurant/orders')}
            className="p-4 bg-white dark:bg-[#2D2D2D] rounded-lg hover:shadow-lg transition-shadow text-left"
          >
            <span className="text-2xl mb-2 block">🔔</span>
            <h3 className="font-medium">Commandes en cours</h3>
            <p className="text-sm text-[#717171] dark:text-[#B3B3B3] mt-1">
              Gérez les commandes entrantes
            </p>
          </button>
          <button
            onClick={() => router.push('/restaurant/settings')}
            className="p-4 bg-white dark:bg-[#2D2D2D] rounded-lg hover:shadow-lg transition-shadow text-left"
          >
            <span className="text-2xl mb-2 block">⚙️</span>
            <h3 className="font-medium">Paramètres</h3>
            <p className="text-sm text-[#717171] dark:text-[#B3B3B3] mt-1">
              Horaires, zones de livraison, etc.
            </p>
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => router.push('/food/restaurants')}
          className="p-4 bg-white dark:bg-[#2D2D2D] rounded-lg hover:shadow-lg transition-shadow text-left"
        >
          <span className="text-2xl mb-2 block">🍽️</span>
          <h3 className="font-medium">Commander à manger</h3>
          <p className="text-sm text-[#717171] dark:text-[#B3B3B3] mt-1">
            Explorez les restaurants à proximité
          </p>
        </button>
        <button
          onClick={() => router.push('/rides/search')}
          className="p-4 bg-white dark:bg-[#2D2D2D] rounded-lg hover:shadow-lg transition-shadow text-left"
        >
          <span className="text-2xl mb-2 block">🚗</span>
          <h3 className="font-medium">Rechercher un trajet</h3>
          <p className="text-sm text-[#717171] dark:text-[#B3B3B3] mt-1">
            Trouvez un covoiturage ou envoyez un colis
          </p>
        </button>
        <button
          onClick={() => router.push('/rides/propose')}
          className="p-4 bg-white dark:bg-[#2D2D2D] rounded-lg hover:shadow-lg transition-shadow text-left"
        >
          <span className="text-2xl mb-2 block">📦</span>
          <h3 className="font-medium">Proposer un trajet</h3>
          <p className="text-sm text-[#717171] dark:text-[#B3B3B3] mt-1">
            Publiez votre trajet ou livraison
          </p>
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User Type Selector */}
      <div className="mb-8">
        <div className="inline-flex rounded-lg p-1 bg-[#F5F5F5] dark:bg-[#3D3D3D]">
          <button
            onClick={() => setUserType('user')}
            className={`px-4 py-2 rounded-lg ${
              userType === 'user'
                ? 'bg-white dark:bg-[#2D2D2D] shadow'
                : 'text-[#717171] dark:text-[#B3B3B3]'
            }`}
          >
            Utilisateur
          </button>
          <button
            onClick={() => setUserType('driver')}
            className={`px-4 py-2 rounded-lg ${
              userType === 'driver'
                ? 'bg-white dark:bg-[#2D2D2D] shadow'
                : 'text-[#717171] dark:text-[#B3B3B3]'
            }`}
          >
            Livreur
          </button>
          <button
            onClick={() => setUserType('restaurant')}
            className={`px-4 py-2 rounded-lg ${
              userType === 'restaurant'
                ? 'bg-white dark:bg-[#2D2D2D] shadow'
                : 'text-[#717171] dark:text-[#B3B3B3]'
            }`}
          >
            Restaurant
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Vue d'ensemble</h2>
        {renderMetrics()}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
        {renderQuickActions()}
      </div>

      {/* Orders/Deliveries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {userType === 'driver'
              ? 'Mes livraisons'
              : userType === 'restaurant'
              ? 'Commandes'
              : 'Mes commandes'}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'current'
                  ? 'bg-[#007AFF] text-white'
                  : 'bg-[#F5F5F5] dark:bg-[#3D3D3D] text-[#717171] dark:text-[#B3B3B3]'
              }`}
            >
              En cours
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'history'
                  ? 'bg-[#007AFF] text-white'
                  : 'bg-[#F5F5F5] dark:bg-[#3D3D3D] text-[#717171] dark:text-[#B3B3B3]'
              }`}
            >
              Historique
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white dark:bg-[#2D2D2D] rounded-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {order.type === 'food' ? '🍽️' : '📦'}
                    </span>
                    <span className="font-medium">
                      Commande #{order.id}
                    </span>
                    <span className={`px-2 py-1 text-sm rounded-full ${
                      order.status === 'delivered'
                        ? 'bg-[#38D39F]/10 text-[#38D39F]'
                        : order.status === 'picked_up'
                        ? 'bg-[#007AFF]/10 text-[#007AFF]'
                        : 'bg-[#FFB800]/10 text-[#FFB800]'
                    }`}>
                      {order.status === 'delivered'
                        ? 'Livré'
                        : order.status === 'picked_up'
                        ? 'En livraison'
                        : 'En préparation'}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Pickup:</span> {order.pickup.address}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Dropoff:</span> {order.dropoff.address}
                    </p>
                    {order.items && (
                      <div className="mt-2">
                        <p className="font-medium text-sm">Articles:</p>
                        <ul className="mt-1 space-y-1">
                          {order.items.map((item, index) => (
                            <li key={index} className="text-sm">
                              {item.quantity}x {item.name} - {item.price.toFixed(2)}€
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-medium">{order.total.toFixed(2)}€</p>
                  <p className="text-sm text-[#717171] dark:text-[#B3B3B3]">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  {order.confirmationCode && (
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Code:</span> {order.confirmationCode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
