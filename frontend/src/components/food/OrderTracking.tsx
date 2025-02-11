import { useEffect, useState } from 'react';
import { FoodOrder } from '../../types/food';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

interface OrderTrackingProps {
  order: FoodOrder;
}

export const OrderTracking = ({ order }: OrderTrackingProps) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string>('');

  const mapCenter = {
    lat: (order.deliveryAddress.coordinates.lat + (order.courierLocation?.lat || order.deliveryAddress.coordinates.lat)) / 2,
    lng: (order.deliveryAddress.coordinates.lng + (order.courierLocation?.lng || order.deliveryAddress.coordinates.lng)) / 2,
  };

  useEffect(() => {
    if (!order.courierLocation) return;

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: order.courierLocation,
        destination: order.deliveryAddress.coordinates,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
          if (result?.routes[0]?.legs[0]?.duration) {
            setEstimatedTime(result.routes[0].legs[0].duration.text);
          }
        }
      }
    );
  }, [order.courierLocation, order.deliveryAddress]);

  const getStatusStep = () => {
    const steps = [
      'confirmed',
      'preparing',
      'ready',
      'picked_up',
      'delivering',
      'delivered'
    ];
    return steps.indexOf(order.status) + 1;
  };

  return (
    <div className="bg-[#242F3D] rounded-xl p-4">
      {/* Status Timeline */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Order Status</h3>
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#2AABEE]/20 -translate-y-1/2" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-[#2AABEE] -translate-y-1/2 transition-all"
            style={{ width: `${(getStatusStep() / 6) * 100}%` }}
          />
          <div className="relative flex justify-between">
            {['Confirmed', 'Preparing', 'Ready', 'Picked Up', 'On Way', 'Delivered'].map((status, index) => (
              <div
                key={status}
                className={`flex flex-col items-center ${
                  index < getStatusStep() ? 'text-[#2AABEE]' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full ${
                    index < getStatusStep() ? 'bg-[#2AABEE]' : 'bg-[#2AABEE]/20'
                  }`}
                />
                <span className="text-xs mt-2">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-64 rounded-xl overflow-hidden mb-4">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={13}
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
          {order.courierLocation && (
            <Marker
              position={order.courierLocation}
              icon={{
                url: '/courier-marker.svg',
                scaledSize: new google.maps.Size(40, 40)
              }}
            />
          )}
          
          <Marker
            position={order.deliveryAddress.coordinates}
            icon={{
              url: '/destination-marker.svg',
              scaledSize: new google.maps.Size(40, 40)
            }}
          />

          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>

      {/* Delivery Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Estimated Time:</span>
          <span className="text-white font-semibold">{estimatedTime || 'Calculating...'}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Delivery Address:</span>
          <span className="text-white">{order.deliveryAddress.street}</span>
        </div>

        {order.deliveryAddress.instructions && (
          <div className="bg-[#2AABEE]/10 p-3 rounded-lg">
            <span className="text-[#2AABEE] font-semibold">Delivery Instructions:</span>
            <p className="text-gray-400 mt-1">{order.deliveryAddress.instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
};
