import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Location {
  lat: number;
  lng: number;
}

interface MapsContextType {
  isLoaded: boolean;
  currentLocation: Location | null;
  searchPlaces: (query: string) => Promise<google.maps.places.PlaceResult[]>;
  calculateRoute: (origin: Location, destination: Location) => Promise<google.maps.DirectionsResult>;
  geocodeAddress: (address: string) => Promise<Location>;
}

const MapsContext = createContext<MapsContextType | undefined>(undefined);

export function MapsProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'directions', 'geometry']
    });

    loader.load().then(() => {
      // Initialize services
      const mapDiv = document.createElement('div');
      const map = new google.maps.Map(mapDiv, {
        center: { lat: 0, lng: 0 },
        zoom: 2
      });

      setPlacesService(new google.maps.places.PlacesService(map));
      setDirectionsService(new google.maps.DirectionsService());
      setGeocoder(new google.maps.Geocoder());
      setIsLoaded(true);

      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.error('Error getting current location:', error);
          }
        );
      }
    }).catch((error) => {
      console.error('Error loading Google Maps:', error);
    });
  }, []);

  const searchPlaces = async (query: string): Promise<google.maps.places.PlaceResult[]> => {
    if (!placesService) throw new Error('Places service not initialized');

    return new Promise((resolve, reject) => {
      const request: google.maps.places.TextSearchRequest = {
        query,
        location: currentLocation || undefined,
        radius: 5000 // 5km radius
      };

      placesService.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          reject(new Error('Places search failed'));
        }
      });
    });
  };

  const calculateRoute = async (
    origin: Location,
    destination: Location
  ): Promise<google.maps.DirectionsResult> => {
    if (!directionsService) throw new Error('Directions service not initialized');

    const request: google.maps.DirectionsRequest = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true
    };

    return new Promise((resolve, reject) => {
      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          resolve(result);
        } else {
          reject(new Error('Route calculation failed'));
        }
      });
    });
  };

  const geocodeAddress = async (address: string): Promise<Location> => {
    if (!geocoder) throw new Error('Geocoder not initialized');

    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          reject(new Error('Geocoding failed'));
        }
      });
    });
  };

  return (
    <MapsContext.Provider
      value={{
        isLoaded,
        currentLocation,
        searchPlaces,
        calculateRoute,
        geocodeAddress
      }}
    >
      {children}
    </MapsContext.Provider>
  );
}

export function useMaps() {
  const context = useContext(MapsContext);
  if (context === undefined) {
    throw new Error('useMaps must be used within a MapsProvider');
  }
  return context;
}
