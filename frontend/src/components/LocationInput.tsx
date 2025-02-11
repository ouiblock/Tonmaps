import { useState, useEffect, useRef } from 'react';
import { mapsService, Location, PlaceResult } from '../services/MapsService';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: Location) => void;
  placeholder: string;
  label: string;
  selected?: boolean;
}

export default function LocationInput({
  value,
  onChange,
  onLocationSelect,
  placeholder,
  label,
  selected,
}: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const searchPlaces = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await mapsService.searchPlaces(query);
      setSuggestions(results);
    } catch (error) {
      console.error('Error searching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      searchPlaces(newValue);
    }, 300);

    setIsOpen(true);
  };

  const handleSuggestionClick = async (suggestion: PlaceResult) => {
    onChange(suggestion.address);
    onLocationSelect(suggestion.location);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {selected && '✓'}
      </label>
      <div className="mt-1 relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0088CC] focus:ring-[#0088CC] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin h-5 w-5 border-2 border-[#0088CC] border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.placeId}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              {suggestion.address}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
