import { useEffect, useRef, useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';

interface SearchBoxProps {
  placeholder: string;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  value?: string;
  className?: string;
}

const SearchBox = ({ placeholder, onPlaceSelect, value, className }: SearchBoxProps) => {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        onPlaceSelect(place);
      } else {
        console.warn("Place selected has no geometry");
      }
    }
  };

  useEffect(() => {
    return () => {
      setAutocomplete(null);
    };
  }, []);

  return (
    <div className="relative">
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        restrictions={{ country: "fr" }}
        fields={["address_components", "geometry", "name", "formatted_address"]}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          defaultValue={value}
          className={`w-full px-4 py-3 rounded-xl border-2 border-[#17212B] focus:border-[#2AABEE] focus:ring-1 focus:ring-[#2AABEE] outline-none text-gray-900 placeholder-gray-500 bg-white ${className}`}
        />
      </Autocomplete>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
};

export default SearchBox;
