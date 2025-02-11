import { useEffect, useRef, useState } from 'react';
import { mapsService } from '../services/MapsService';

interface Location {
  lat: number;
  lng: number;
}

interface MapProps {
  center?: Location;
  zoom?: number;
  markers?: Location[];
  onMapClick?: (location: Location) => void;
  className?: string;
}

export default function Map({
  center = { lat: 48.8566, lng: 2.3522 }, // Paris by default
  zoom = 13,
  markers = [],
  onMapClick,
  className = ''
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        await mapsService.initialize();

        const newMap = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#242f3d" }]
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#242f3d" }]
            },
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#746855" }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17212b" }]
            }
          ],
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true
        });

        if (onMapClick) {
          newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
              onMapClick({
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
              });
            }
          });
        }

        setMap(newMap);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    return () => {
      // Cleanup markers
      mapMarkers.forEach(marker => marker.setMap(null));
    };
  }, []);

  // Update markers when they change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null));

    // Create new markers
    const newMarkers = markers.map(position => {
      return new google.maps.Marker({
        position,
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: '#0088CC',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        }
      });
    });

    setMapMarkers(newMarkers);
  }, [map, markers]);

  // Update center when it changes
  useEffect(() => {
    if (map) {
      map.setCenter(center);
    }
  }, [map, center]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full min-h-[400px] rounded-lg ${className}`}
    />
  );
}
