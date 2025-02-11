import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import Map from './Map';
import SearchBox from './SearchBox';
import RideListingCard from './RideListingCard';
import { exampleRides, exampleUsers } from '../data/exampleData';
import { Ride, User } from '../types';

type ServiceType = 'ride' | 'delivery' | null;
type UserType = 'driver' | 'passenger' | 'sender' | 'receiver' | null;

const AppInterface = () => {
  const { address } = useWallet();
  const [selectedService, setSelectedService] = useState<ServiceType>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | undefined>();
  const [destination, setDestination] = useState<google.maps.LatLngLiteral | undefined>();
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'TON' | 'OZR' | 'USD'>('TON');
  const [preferences, setPreferences] = useState({
    smoking: false,
    pets: false,
    music: false,
    luggageSize: 'medium' as 'small' | 'medium' | 'large'
  });

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setUserType(null);
    setIsSearching(false);
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setIsSearching(false);
  };

  const handleOriginSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      setOrigin({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      });
    }
  };

  const handleDestinationSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      setDestination({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      });
    }
  };

  const renderUserTypeOptions = () => {
    if (selectedService === 'ride') {
      return (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleUserTypeSelect('driver')}
            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
              userType === 'driver'
                ? 'border-[#2AABEE] bg-[#2AABEE]/5 text-[#2AABEE]'
                : 'border-gray-100 hover:border-[#2AABEE]/30 hover:bg-[#2AABEE]/5'
            }`}
          >
            <span className="text-2xl mb-2">🚗</span>
            <span className="font-medium">I'm driving</span>
            <span className="text-sm text-gray-500 mt-1">Offer rides</span>
          </button>
          <button
            onClick={() => handleUserTypeSelect('passenger')}
            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
              userType === 'passenger'
                ? 'border-[#2AABEE] bg-[#2AABEE]/5 text-[#2AABEE]'
                : 'border-gray-100 hover:border-[#2AABEE]/30 hover:bg-[#2AABEE]/5'
            }`}
          >
            <span className="text-2xl mb-2">👋</span>
            <span className="font-medium">I need a ride</span>
            <span className="text-sm text-gray-500 mt-1">Find drivers</span>
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleUserTypeSelect('sender')}
          className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
            userType === 'sender'
              ? 'border-[#2AABEE] bg-[#2AABEE]/5 text-[#2AABEE]'
              : 'border-gray-100 hover:border-[#2AABEE]/30 hover:bg-[#2AABEE]/5'
          }`}
        >
          <span className="text-2xl mb-2">📦</span>
          <span className="font-medium">Send package</span>
          <span className="text-sm text-gray-500 mt-1">Find couriers</span>
        </button>
        <button
          onClick={() => handleUserTypeSelect('receiver')}
          className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
            userType === 'receiver'
              ? 'border-[#2AABEE] bg-[#2AABEE]/5 text-[#2AABEE]'
              : 'border-gray-100 hover:border-[#2AABEE]/30 hover:bg-[#2AABEE]/5'
          }`}
        >
          <span className="text-2xl mb-2">🚚</span>
          <span className="font-medium">Deliver packages</span>
          <span className="text-sm text-gray-500 mt-1">Earn TON</span>
        </button>
      </div>
    );
  };

  const renderContent = () => {
    if (!selectedService || !userType) {
      return null;
    }

    if (isSearching) {
      return (
        <div className="space-y-4">
          {exampleRides.map(ride => {
            const driver = exampleUsers.find(u => u.address === ride.driver)!;
            return (
              <RideListingCard
                key={ride.id}
                ride={ride}
                driver={driver}
                onClick={() => {
                  console.log('Selected ride:', ride);
                }}
              />
            );
          })}
          <button
            onClick={() => setIsSearching(false)}
            className="w-full mt-4 border-2 border-red-500 text-red-500 py-3 rounded-xl font-medium hover:bg-red-50 transition-all"
          >
            Cancel Search
          </button>
        </div>
      );
    }

    if (userType === 'driver' || userType === 'sender') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starting Point</label>
            <SearchBox
              placeholder="Enter your location"
              onPlaceSelect={handleOriginSelect}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <SearchBox
              placeholder="Where are you heading?"
              onPlaceSelect={handleDestinationSelect}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <div className="relative">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-[#17212B] focus:border-[#2AABEE] focus:ring-1 focus:ring-[#2AABEE] outline-none text-gray-900 placeholder-gray-500 bg-white transition-all"
                  placeholder="Amount"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
                  {currency}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'TON' | 'OZR' | 'USD')}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#17212B] focus:border-[#2AABEE] focus:ring-1 focus:ring-[#2AABEE] outline-none appearance-none bg-white text-gray-900 transition-all"
              >
                <option value="TON">TON</option>
                <option value="OZR">OZR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {userType === 'driver' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  defaultValue="3"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#17212B] focus:border-[#2AABEE] focus:ring-1 focus:ring-[#2AABEE] outline-none text-gray-900 bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Preferences</label>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setPreferences(p => ({ ...p, smoking: !p.smoking }))}
                    className={`flex items-center px-4 py-2 rounded-xl border-2 transition-all ${
                      preferences.smoking
                        ? 'border-[#2AABEE] bg-[#2AABEE]/5 text-[#2AABEE]'
                        : 'border-gray-100 hover:border-[#2AABEE]/30'
                    }`}
                  >
                    <span className="mr-2">🚬</span>
                    <span>Smoking</span>
                  </button>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, pets: !p.pets }))}
                    className={`flex items-center px-4 py-2 rounded-xl border-2 transition-all ${
                      preferences.pets
                        ? 'border-[#2AABEE] bg-[#2AABEE]/5 text-[#2AABEE]'
                        : 'border-gray-100 hover:border-[#2AABEE]/30'
                    }`}
                  >
                    <span className="mr-2">🐾</span>
                    <span>Pets</span>
                  </button>
                  <button
                    onClick={() => setPreferences(p => ({ ...p, music: !p.music }))}
                    className={`flex items-center px-4 py-2 rounded-xl border-2 transition-all ${
                      preferences.music
                        ? 'border-[#2AABEE] bg-[#2AABEE]/5 text-[#2AABEE]'
                        : 'border-gray-100 hover:border-[#2AABEE]/30'
                    }`}
                  >
                    <span className="mr-2">🎵</span>
                    <span>Music</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
          <SearchBox
            placeholder="Enter pickup location"
            onPlaceSelect={handleOriginSelect}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
          <SearchBox
            placeholder="Enter destination"
            onPlaceSelect={handleDestinationSelect}
          />
        </div>
        {userType === 'passenger' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Passengers</label>
            <input
              type="number"
              min="1"
              max="6"
              defaultValue="1"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#17212B] focus:border-[#2AABEE] focus:ring-1 focus:ring-[#2AABEE] outline-none text-gray-900 bg-white transition-all"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#17212B]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Panel - Service Selection and Forms */}
          <div className="bg-[#242F3D] p-6 rounded-2xl shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-transparent bg-clip-text">
                  Onzroad
                </h2>
                {address && (
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                )}
              </div>
              {address ? (
                <>
                  {!selectedService ? (
                    <div className="space-y-4">
                      <button
                        onClick={() => setSelectedService('ride')}
                        className="w-full bg-[#2AABEE] text-white py-3 rounded-xl font-medium hover:bg-[#229ED9] transition-all"
                      >
                        Find a Ride
                      </button>
                      <button
                        onClick={() => setSelectedService('delivery')}
                        className="w-full border-2 border-[#2AABEE] text-[#2AABEE] py-3 rounded-xl font-medium hover:bg-[#2AABEE]/10 transition-all"
                      >
                        Send a Package
                      </button>
                    </div>
                  ) : !userType ? (
                    <div className="space-y-4">
                      {renderUserTypeOptions()}
                      <button
                        onClick={() => setSelectedService(null)}
                        className="w-full text-gray-400 py-2 hover:text-white transition-colors flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {renderContent()}
                      {!isSearching && (
                        <>
                          <button
                            onClick={() => setIsSearching(true)}
                            className="w-full bg-[#2AABEE] text-white py-3 rounded-xl font-medium hover:bg-[#229ED9] transition-all flex items-center justify-center space-x-2"
                          >
                            <span>Search</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setUserType(null)}
                            className="w-full text-gray-400 py-2 hover:text-white transition-colors flex items-center justify-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Back</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#2AABEE]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#2AABEE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-400">Connect your TON wallet to continue</p>
                </div>
              )}
            </div>
          </div>

          {/* Map Area (Right Panel) */}
          <div className="md:col-span-2 bg-[#242F3D] rounded-2xl shadow-sm overflow-hidden">
            <Map
              origin={origin}
              destination={destination}
              markers={[
                ...(origin ? [origin] : []),
                ...(destination ? [destination] : [])
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppInterface;
