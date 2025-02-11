import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export interface PlaceRecommendation {
  placeId: string;
  name: string;
  address: string;
  rating?: number;
  types: string[];
  distance?: string;
  openNow?: boolean;
}

export type TravelMode = 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';

export interface Location {
  lat: number;
  lng: number;
}

export interface PlaceResult {
  location: Location;
  address: string;
  placeId: string;
}

class MapsService {
  private loader: Loader;
  private googleMaps: typeof google.maps | null = null;
  private autocompleteService: google.maps.places.AutocompleteService | null = null;
  private placesService: google.maps.places.PlacesService | null = null;
  private directionsService: google.maps.DirectionsService | null = null;
  private geocoder: google.maps.Geocoder | null = null;
  private isInitialized = false;

  constructor() {
    this.loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry', 'routes'],
    });
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.loader.load();
      this.googleMaps = google.maps;
      this.isInitialized = true;
    } catch (error) {
      console.error('Error loading Google Maps:', error);
      throw error;
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  async createMap(element: HTMLElement, options: google.maps.MapOptions): Promise<google.maps.Map> {
    await this.ensureInitialized();
    return new google.maps.Map(element, options);
  }

  async getCurrentPosition(): Promise<google.maps.LatLng> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
          },
          (error) => reject(error)
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  }

  async getPlacePredictions(
    input: string,
    types: string[] = ['establishment', 'geocode']
  ): Promise<google.maps.places.AutocompletePrediction[]> {
    await this.ensureInitialized();

    if (!this.autocompleteService) {
      this.autocompleteService = new google.maps.places.AutocompleteService();
    }

    try {
      const response = await this.autocompleteService.getPlacePredictions({
        input,
        types,
        componentRestrictions: { country: 'FR' },
      });
      return response.predictions;
    } catch (error) {
      console.error('Error getting place predictions:', error);
      return [];
    }
  }

  async getPlaceDetails(placeId: string): Promise<google.maps.places.PlaceResult | null> {
    await this.ensureInitialized();

    if (!this.placesService) {
      const mapDiv = document.createElement('div');
      const map = await this.createMap(mapDiv, { center: { lat: 0, lng: 0 }, zoom: 1 });
      this.placesService = new google.maps.places.PlacesService(map);
    }

    return new Promise((resolve, reject) => {
      this.placesService!.getDetails(
        { placeId, fields: ['geometry', 'formatted_address', 'name', 'rating', 'opening_hours', 'types', 'photos'] },
        (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            resolve(result);
          } else {
            reject(new Error(`Place details request failed: ${status}`));
          }
        }
      );
    });
  }

  async getNearbyPlaces(
    location: google.maps.LatLng,
    radius: number = 1000,
    type?: string
  ): Promise<google.maps.places.PlaceResult[]> {
    await this.ensureInitialized();

    if (!this.placesService) {
      const mapDiv = document.createElement('div');
      const map = await this.createMap(mapDiv, { center: { lat: 0, lng: 0 }, zoom: 1 });
      this.placesService = new google.maps.places.PlacesService(map);
    }

    return new Promise((resolve) => {
      const request: google.maps.places.PlaceSearchRequest = {
        location,
        radius,
        type: type as google.maps.places.PlaceType,
      };

      this.placesService!.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          resolve([]);
        }
      });
    });
  }

  async getDirections(
    origin: google.maps.LatLng,
    destination: google.maps.LatLng,
    travelMode: TravelMode = 'DRIVING',
    alternatives: boolean = true
  ): Promise<google.maps.DirectionsResult | null> {
    await this.ensureInitialized();

    if (!this.directionsService) {
      this.directionsService = new google.maps.DirectionsService();
    }

    try {
      const result = await this.directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode[travelMode],
        alternatives,
        provideRouteAlternatives: alternatives,
      });
      return result;
    } catch (error) {
      console.error('Error getting directions:', error);
      return null;
    }
  }

  async getSmartRecommendations(
    input: string,
    userLocation: google.maps.LatLng
  ): Promise<PlaceRecommendation[]> {
    await this.ensureInitialized();
    let recommendations: PlaceRecommendation[] = [];

    // Get initial predictions
    const predictions = await this.getPlacePredictions(input);
    
    // Get details for each prediction
    const detailsPromises = predictions.slice(0, 5).map(async (prediction) => {
      const details = await this.getPlaceDetails(prediction.place_id);
      if (!details || !details.geometry?.location) return null;

      // Calculate distance from user
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        userLocation,
        details.geometry.location
      );

      return {
        placeId: prediction.place_id,
        name: details.name || '',
        address: details.formatted_address || '',
        rating: details.rating,
        types: details.types || [],
        distance: this.formatDistance(distance),
        openNow: details.opening_hours?.isOpen(),
      };
    });

    const results = await Promise.all(detailsPromises);
    recommendations = results.filter((r): r is PlaceRecommendation => r !== null);

    // Sort by relevance (combination of distance and rating)
    recommendations.sort((a, b) => {
      const aScore = (a.rating || 0) * 2 - (this.parseDistance(a.distance || '') || 0);
      const bScore = (b.rating || 0) * 2 - (this.parseDistance(b.distance || '') || 0);
      return bScore - aScore;
    });

    return recommendations;
  }

  async searchPlaces(query: string): Promise<PlaceResult[]> {
    await this.ensureInitialized();

    if (!this.autocompleteService) {
      this.autocompleteService = new google.maps.places.AutocompleteService();
    }

    try {
      const predictions = await this.autocompleteService.getPlacePredictions({
        input: query,
        types: ['geocode', 'establishment'],
      });

      if (!predictions.predictions.length) {
        return [];
      }

      if (!this.placesService) {
        // Create a temporary div for PlacesService (required by Google Maps API)
        const tempDiv = document.createElement('div');
        this.placesService = new google.maps.places.PlacesService(tempDiv);
      }

      const results = await Promise.all(
        predictions.predictions.map(async (prediction) => {
          return new Promise<PlaceResult>((resolve, reject) => {
            this.placesService!.getDetails(
              {
                placeId: prediction.place_id,
                fields: ['geometry', 'formatted_address'],
              },
              (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
                  resolve({
                    location: {
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng(),
                    },
                    address: place.formatted_address || prediction.description,
                    placeId: prediction.place_id,
                  });
                } else {
                  reject(new Error('Failed to get place details'));
                }
              }
            );
          });
        })
      );

      return results;
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }

  async geocodeAddress(address: string): Promise<Location | null> {
    await this.ensureInitialized();

    if (!this.geocoder) {
      this.geocoder = new google.maps.Geocoder();
    }

    try {
      const result = await this.geocoder.geocode({ address });
      if (result.results[0]?.geometry?.location) {
        return {
          lat: result.results[0].geometry.location.lat(),
          lng: result.results[0].geometry.location.lng(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  private formatDistance(meters: number): string {
    return meters > 1000
      ? `${(meters / 1000).toFixed(1)} km`
      : `${Math.round(meters)} m`;
  }

  private parseDistance(distance: string): number {
    const value = parseFloat(distance);
    return distance.includes('km') ? value * 1000 : value;
  }
}

export const mapsService = new MapsService();
