import { useState, useEffect, useRef } from 'react';
import { mapsService } from '../services/MapsService';

interface LocationAutocompleteProps {
  label: string;
  placeholder: string;
  onLocationSelect: (location: {
    placeId: string;
    address: string;
    lat: number;
    lng: number;
  }) => void;
  onInputChange?: (input: string) => void;
}

export default function LocationAutocomplete({
  label,
  placeholder,
  onLocationSelect,
  onInputChange,
}: LocationAutocompleteProps) {
  const [input, setInput] = useState('');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowPredictions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (input.length > 2) {
        setLoading(true);
        const results = await mapsService.getPlacePredictions(input);
        setPredictions(results);
        setShowPredictions(true);
        setLoading(false);
        
        // Call onInputChange if provided
        onInputChange?.(input);
      } else {
        setPredictions([]);
        setShowPredictions(false);
      }
    };

    const debounce = setTimeout(fetchPredictions, 300);
    return () => clearTimeout(debounce);
  }, [input, onInputChange]);

  const handlePredictionSelect = async (prediction: google.maps.places.AutocompletePrediction) => {
    const placeDetails = await mapsService.getPlaceDetails(prediction.place_id);
    if (placeDetails?.geometry?.location) {
      const location = {
        placeId: prediction.place_id,
        address: prediction.description,
        lat: placeDetails.geometry.location.lat(),
        lng: placeDetails.geometry.location.lng(),
      };
      onLocationSelect(location);
      setInput(prediction.description);
      setShowPredictions(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#2D2D2D] pr-10"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#007AFF] border-t-transparent"></div>
          </div>
        )}
      </div>
      
      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#2D2D2D] rounded-lg shadow-lg border border-[#E0E0E0] dark:border-[#404040] max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              onClick={() => handlePredictionSelect(prediction)}
              className="w-full px-4 py-3 text-left hover:bg-[#F5F5F5] dark:hover:bg-[#3D3D3D] transition-colors border-b border-[#E0E0E0] dark:border-[#404040] last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <span className="text-lg mt-0.5">📍</span>
                <div>
                  <p className="font-medium">
                    {prediction.structured_formatting.main_text}
                  </p>
                  <p className="text-sm text-[#717171] dark:text-[#B3B3B3]">
                    {prediction.structured_formatting.secondary_text}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
