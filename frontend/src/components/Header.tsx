import { useEffect, useState } from 'react';

interface Location {
  lat: number;
  lng: number;
}

const Header = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        () => setIsLoading(false)
      );
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <header className="w-full bg-blue-500 text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">TONmaps</h1>
        <div className="text-sm">
          {isLoading ? (
            'Getting location...'
          ) : userLocation ? (
            `Location: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
          ) : (
            'No location available'
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
