import { useState, useEffect } from 'react';
import { CourierProfile, FoodOrder } from '../../types/food';
import { GoogleMap, Marker } from '@react-google-maps/api';

interface CourierDashboardProps {
  profile: CourierProfile;
  availableOrders: FoodOrder[];
  onAcceptOrder: (orderId: string) => void;
  onUpdateLocation: (lat: number, lng: number) => void;
}

export const CourierDashboard = ({
  profile,
  availableOrders,
  onAcceptOrder,
  onUpdateLocation
}: CourierDashboardProps) => {
  const [selectedOrder, setSelectedOrder] = useState<FoodOrder | null>(null);

  // Simulate location updates
  useEffect(() => {
    if (profile.status === 'available') {
      const interval = setInterval(() => {
        const lat = profile.currentLocation.lat + (Math.random() - 0.5) * 0.001;
        const lng = profile.currentLocation.lng + (Math.random() - 0.5) * 0.001;
        onUpdateLocation(lat, lng);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [profile.status]);

  return (
    <div className="min-h-screen bg-[#17212B] p-4">
      {/* Header */}
      <div className="bg-[#242F3D] rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Courier Dashboard</h2>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                profile.status === 'available'
                  ? 'bg-green-500'
                  : profile.status === 'busy'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
            />
            <span className="text-gray-400">
              {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#17212B] rounded-lg p-3">
            <div className="text-sm text-gray-400">Today's Earnings</div>
            <div className="text-lg font-bold text-white">${profile.earnings.today}</div>
          </div>
          <div className="bg-[#17212B] rounded-lg p-3">
            <div className="text-sm text-gray-400">Total Deliveries</div>
            <div className="text-lg font-bold text-white">{profile.totalDeliveries}</div>
          </div>
          <div className="bg-[#17212B] rounded-lg p-3">
            <div className="text-sm text-gray-400">Rating</div>
            <div className="text-lg font-bold text-white">⭐ {profile.rating.toFixed(1)}</div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-[#242F3D] rounded-xl overflow-hidden mb-4">
        <div className="h-64">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={profile.currentLocation}
            zoom={14}
            options={{
              styles: [
                {
                  featureType: 'all',
                  elementType: 'geometry',
                  stylers: [{ color: '#242F3D' }]
                },
                {
                  featureType: 'all',
                  elementType: 'labels.text.fill',
                  stylers: [{ color: '#746855' }]
                },
                {
                  featureType: 'all',
                  elementType: 'labels.text.stroke',
                  stylers: [{ color: '#242F3D' }]
                },
              ]
            }}
          >
            <Marker
              position={profile.currentLocation}
              icon={{
                url: '/courier-marker.svg',
                scaledSize: new google.maps.Size(40, 40)
              }}
            />
            
            {availableOrders.map(order => (
              <Marker
                key={order.id}
                position={order.deliveryAddress.coordinates}
                icon={{
                  url: '/order-marker.svg',
                  scaledSize: new google.maps.Size(40, 40)
                }}
                onClick={() => setSelectedOrder(order)}
              />
            ))}
          </GoogleMap>
        </div>
      </div>

      {/* Available Orders */}
      <div className="bg-[#242F3D] rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Available Orders</h3>
        <div className="space-y-4">
          {availableOrders.map(order => (
            <div
              key={order.id}
              className={`bg-[#17212B] rounded-lg p-4 cursor-pointer transition-colors ${
                selectedOrder?.id === order.id ? 'border-2 border-[#2AABEE]' : ''
              }`}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-white font-semibold">Order #{order.id.slice(-4)}</h4>
                  <p className="text-sm text-gray-400">{order.deliveryAddress.street}</p>
                </div>
                <div className="text-right">
                  <div className="text-[#2AABEE] font-semibold">${order.deliveryFee}</div>
                  <div className="text-sm text-gray-400">{order.estimatedDeliveryTime} min</div>
                </div>
              </div>

              {selectedOrder?.id === order.id && (
                <div className="mt-4">
                  <div className="text-sm text-gray-400 mb-2">
                    Distance: {calculateDistance(profile.currentLocation, order.deliveryAddress.coordinates).toFixed(1)} km
                  </div>
                  <button
                    onClick={() => onAcceptOrder(order.id)}
                    className="w-full py-2 rounded-lg bg-[#2AABEE] text-white hover:bg-[#2AABEE]/80"
                  >
                    Accept Order
                  </button>
                </div>
              )}
            </div>
          ))}

          {availableOrders.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No available orders at the moment
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(point2.lat - point1.lat);
  const dLng = deg2rad(point2.lng - point1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
