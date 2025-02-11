import { useEffect, useState, useRef } from 'react';
import LocationAutocomplete from '../../components/LocationAutocomplete';
import { mapsService, TravelMode, PlaceRecommendation } from '../../services/MapsService';

interface Location {
  placeId: string;
  address: string;
  lat: number;
  lng: number;
}

const travelModes: { value: TravelMode; label: string; icon: string }[] = [
  { value: 'DRIVING', label: 'Driving', icon: '🚗' },
  { value: 'TRANSIT', label: 'Transit', icon: '🚇' },
  { value: 'WALKING', label: 'Walking', icon: '🚶' },
  { value: 'BICYCLING', label: 'Cycling', icon: '🚲' },
];

export default function CarpoolingSearch() {
  const [mounted, setMounted] = useState(false);
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [route, setRoute] = useState<google.maps.DirectionsResult | null>(null);
  const [travelMode, setTravelMode] = useState<TravelMode>('DRIVING');
  const [showTraffic, setShowTraffic] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(null);
  const [recommendations, setRecommendations] = useState<PlaceRecommendation[]>([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    setMounted(true);
    initMap();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (pickup && destination) {
      calculateRoute();
    }
  }, [pickup, destination, travelMode]);

  useEffect(() => {
    if (showTraffic) {
      showTrafficLayer();
    } else {
      hideTrafficLayer();
    }
  }, [showTraffic]);

  const getUserLocation = async () => {
    try {
      const position = await mapsService.getCurrentPosition();
      setUserLocation(position);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter(position);
      }
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  };

  const initMap = async () => {
    if (!mapRef.current) return;

    const google = await mapsService.init();
    const defaultLocation = { lat: 48.8584, lng: 2.2945 }; // Paris

    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 12,
      styles: [
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#717171' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#e9e9e9' }],
        },
      ],
    });

    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      map: mapInstanceRef.current,
      suppressMarkers: true,
    });

    trafficLayerRef.current = new google.maps.TrafficLayer();
  };

  const showTrafficLayer = () => {
    if (mapInstanceRef.current && trafficLayerRef.current) {
      trafficLayerRef.current.setMap(mapInstanceRef.current);
    }
  };

  const hideTrafficLayer = () => {
    if (trafficLayerRef.current) {
      trafficLayerRef.current.setMap(null);
    }
  };

  const calculateRoute = async () => {
    if (!pickup || !destination) return;

    const google = await mapsService.init();
    const origin = new google.maps.LatLng(pickup.lat, pickup.lng);
    const dest = new google.maps.LatLng(destination.lat, destination.lng);

    const result = await mapsService.getDirections(origin, dest, travelMode, true);
    if (result) {
      setRoute(result);
      directionsRendererRef.current?.setDirections(result);
      directionsRendererRef.current?.setRouteIndex(selectedRouteIndex);

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add custom markers
      if (mapInstanceRef.current) {
        markersRef.current.push(
          new google.maps.Marker({
            position: origin,
            map: mapInstanceRef.current,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#007AFF',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
            },
          }),
          new google.maps.Marker({
            position: dest,
            map: mapInstanceRef.current,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#38D39F',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
            },
          })
        );

        // Get and show nearby places
        const places = await mapsService.getNearbyPlaces(dest, 1000);
        setNearbyPlaces(places);

        // Add markers for nearby places
        places.forEach(place => {
          if (place.geometry?.location) {
            markersRef.current.push(
              new google.maps.Marker({
                position: place.geometry.location,
                map: mapInstanceRef.current!,
                icon: {
                  url: place.icon as string,
                  scaledSize: new google.maps.Size(24, 24),
                },
                title: place.name,
              })
            );
          }
        });
      }
    }
  };

  const handleLocationInput = async (input: string, isPickup: boolean) => {
    if (!userLocation || input.length < 3) return;
    
    const recommendations = await mapsService.getSmartRecommendations(input, userLocation);
    setRecommendations(recommendations);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#2D2D2D] rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Find a Ride</h1>
            
            <div className="space-y-6">
              <LocationAutocomplete
                label="Pickup Location"
                placeholder="Enter pickup location"
                onLocationSelect={setPickup}
                onInputChange={(input) => handleLocationInput(input, true)}
              />
              
              <LocationAutocomplete
                label="Destination"
                placeholder="Enter destination"
                onLocationSelect={setDestination}
                onInputChange={(input) => handleLocationInput(input, false)}
              />

              {recommendations.length > 0 && (
                <div className="p-4 bg-[#F5F5F5] dark:bg-[#3D3D3D] rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Recommended Places</h3>
                  <div className="space-y-2">
                    {recommendations.map((place) => (
                      <button
                        key={place.placeId}
                        onClick={() => {
                          const location = {
                            placeId: place.placeId,
                            address: place.address,
                            lat: 0,
                            lng: 0,
                          };
                          setDestination(location);
                        }}
                        className="w-full text-left p-2 hover:bg-white dark:hover:bg-[#4D4D4D] rounded-lg transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{place.name}</p>
                            <p className="text-sm text-[#717171] dark:text-[#B3B3B3]">
                              {place.address}
                            </p>
                          </div>
                          <div className="text-right text-sm">
                            {place.rating && <div>⭐ {place.rating}</div>}
                            {place.distance && <div>{place.distance}</div>}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#2D2D2D]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#2D2D2D]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Travel Mode</label>
                  <div className="flex space-x-2">
                    {travelModes.map((mode) => (
                      <button
                        key={mode.value}
                        onClick={() => setTravelMode(mode.value)}
                        className={`p-2 rounded-lg ${
                          travelMode === mode.value
                            ? 'bg-[#007AFF] text-white'
                            : 'bg-[#F5F5F5] dark:bg-[#3D3D3D]'
                        }`}
                        title={mode.label}
                      >
                        <span className="text-lg">{mode.icon}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Show Traffic</label>
                  <button
                    onClick={() => setShowTraffic(!showTraffic)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showTraffic ? 'bg-[#007AFF]' : 'bg-[#E0E0E0] dark:bg-[#404040]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showTraffic ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {route && route.routes[selectedRouteIndex].legs[0] && (
                <div className="p-4 bg-[#007AFF]/10 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Distance</span>
                    <span className="font-medium">
                      {route.routes[selectedRouteIndex].legs[0].distance?.text}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Duration</span>
                    <span className="font-medium">
                      {route.routes[selectedRouteIndex].legs[0].duration?.text}
                      {route.routes[selectedRouteIndex].legs[0].duration_in_traffic && (
                        <span className="text-[#FF6B6B]">
                          {' '}
                          (in traffic: {route.routes[selectedRouteIndex].legs[0].duration_in_traffic?.text})
                        </span>
                      )}
                    </span>
                  </div>

                  {route.routes.length > 1 && (
                    <div className="mt-4">
                      <label className="text-sm font-medium mb-2 block">Alternative Routes</label>
                      <div className="space-y-2">
                        {route.routes.map((r, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedRouteIndex(index);
                              directionsRendererRef.current?.setRouteIndex(index);
                            }}
                            className={`w-full p-2 text-sm rounded-lg transition-colors ${
                              selectedRouteIndex === index
                                ? 'bg-[#007AFF] text-white'
                                : 'bg-[#F5F5F5] dark:bg-[#3D3D3D]'
                            }`}
                          >
                            Route {index + 1}: {r.legs[0].distance?.text}, {r.legs[0].duration?.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <button className="w-full bg-[#007AFF] text-white py-3 rounded-lg font-medium hover:bg-[#0056B3] transition-colors">
                Search Rides
              </button>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#2D2D2D] rounded-lg shadow-lg overflow-hidden">
            <div ref={mapRef} className="w-full h-[600px]" />
          </div>
          
          {nearbyPlaces.length > 0 && (
            <div className="mt-4 bg-white dark:bg-[#2D2D2D] rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-medium mb-4">Nearby Places</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {nearbyPlaces.slice(0, 6).map((place, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-[#F5F5F5] dark:bg-[#3D3D3D]"
                  >
                    <div className="flex items-start space-x-2">
                      {place.photos?.[0] ? (
                        <img
                          src={place.photos[0].getUrl()}
                          alt={place.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#E0E0E0] dark:bg-[#4D4D4D] flex items-center justify-center">
                          <span className="text-2xl">📍</span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-sm">{place.name}</h3>
                        {place.rating && (
                          <div className="flex items-center text-xs text-[#FFB800]">
                            <span>⭐</span>
                            <span>{place.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
