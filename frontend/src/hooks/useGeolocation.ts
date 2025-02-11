import { useState, useEffect } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface GeolocationHook {
  location: Location | null;
  error: string | null;
  loading: boolean;
  getAddressFromCoords: (lat: number, lng: number) => Promise<string>;
  getCoordsFromAddress: (address: string) => Promise<Location | null>;
}

export const useGeolocation = (): GeolocationHook => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const address = await getAddressFromCoords(latitude, longitude);
          setLocation({ latitude, longitude, address });
          setLoading(false);
        },
        (error) => {
          setError(error.message);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  }, []);

  const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || '';
    } catch (error) {
      console.error('Error fetching address:', error);
      return '';
    }
  };

  const getCoordsFromAddress = async (address: string): Promise<Location | null> => {
    try {
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`
      );
      const data = await response.json();
      
      if (data && data[0]) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          address: data[0].display_name
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  };

  return {
    location,
    error,
    loading,
    getAddressFromCoords,
    getCoordsFromAddress,
  };
};
