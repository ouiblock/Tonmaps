import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Map from '../../components/Map';
import LocationInput from '../../components/LocationInput';
import DateTimePicker from '../../components/DateTimePicker';
import { Location } from '../../services/MapsService';

export default function RidesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('search');
  
  // Location state
  const [selectedPickup, setSelectedPickup] = useState<Location | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Location | null>(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);

  const markers = [
    ...(selectedPickup ? [selectedPickup] : []),
    ...(selectedDestination ? [selectedDestination] : [])
  ];

  const handleMapClick = useCallback((location: Location) => {
    if (!selectedPickup) {
      setSelectedPickup(location);
      setPickupAddress(`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
    } else if (!selectedDestination) {
      setSelectedDestination(location);
      setDestinationAddress(`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
    }
  }, [selectedPickup, selectedDestination]);

  const handleRideRequest = () => {
    if (!selectedPickup || !selectedDestination) return;
    
    // In a real app, this would send the request to a backend
    console.log('Requesting ride:', {
      pickup: selectedPickup,
      destination: selectedDestination,
      scheduledTime: scheduledTime,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rides</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Find a ride or propose your own journey
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('search')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'search'
                  ? 'border-[#0088CC] text-[#0088CC]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Search Rides
            </button>
            <button
              onClick={() => setActiveTab('propose')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'propose'
                  ? 'border-[#0088CC] text-[#0088CC]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Propose a Ride
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Form */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
            {activeTab === 'search' ? (
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Search for a Ride</h2>
                <LocationInput
                  value={pickupAddress}
                  onChange={setPickupAddress}
                  onLocationSelect={(location) => setSelectedPickup(location)}
                  placeholder="Enter pickup location or click on map"
                  label="Pickup Location"
                  selected={!!selectedPickup}
                />
                <LocationInput
                  value={destinationAddress}
                  onChange={setDestinationAddress}
                  onLocationSelect={(location) => setSelectedDestination(location)}
                  placeholder="Enter destination or click on map"
                  label="Destination"
                  selected={!!selectedDestination}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date
                  </label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0088CC] focus:ring-[#0088CC]"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Schedule Ride
                    </label>
                    <button
                      onClick={() => setIsScheduling(!isScheduling)}
                      className="text-sm text-[#0088CC] hover:text-[#0088CC]/80"
                    >
                      {isScheduling ? 'Ride Now' : 'Schedule for Later'}
                    </button>
                  </div>
                  {isScheduling && (
                    <DateTimePicker
                      selectedDate={scheduledTime}
                      onChange={setScheduledTime}
                    />
                  )}
                </div>
                <button
                  onClick={handleRideRequest}
                  disabled={!selectedPickup || !selectedDestination}
                  className="w-full bg-[#0088CC] text-white py-2 px-4 rounded-md hover:bg-[#0088CC]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isScheduling ? 'Schedule Ride' : 'Search Rides'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Propose a Ride</h2>
                <LocationInput
                  value={pickupAddress}
                  onChange={setPickupAddress}
                  onLocationSelect={(location) => setSelectedPickup(location)}
                  placeholder="Enter departure location or click on map"
                  label="Departure"
                  selected={!!selectedPickup}
                />
                <LocationInput
                  value={destinationAddress}
                  onChange={setDestinationAddress}
                  onLocationSelect={(location) => setSelectedDestination(location)}
                  placeholder="Enter arrival location or click on map"
                  label="Arrival"
                  selected={!!selectedDestination}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0088CC] focus:ring-[#0088CC]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Available Seats
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    defaultValue="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0088CC] focus:ring-[#0088CC]"
                  />
                </div>
                <button
                  className="w-full bg-[#0088CC] text-white py-2 px-4 rounded-md hover:bg-[#0088CC]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedPickup || !selectedDestination}
                >
                  Propose Ride
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Map */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <Map
            markers={markers}
            onMapClick={handleMapClick}
            className="h-[600px]"
          />
        </div>
      </div>
    </div>
  );
}
