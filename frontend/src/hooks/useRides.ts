import { useState, useCallback } from 'react';
import { Ride, Location } from '../types';
import RideService from '../services/RideService';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';

interface UseRidesReturn {
  rides: Ride[];
  activeRide: Ride | null;
  isLoading: boolean;
  error: string | null;
  createRide: (params: CreateRideParams) => Promise<void>;
  searchRides: (params: SearchRideParams) => Promise<void>;
  bookRide: (rideId: string) => Promise<void>;
  cancelRide: (rideId: string) => Promise<void>;
  loadUserRides: () => Promise<void>;
}

interface CreateRideParams {
  pickup: Location;
  destination: Location;
  departureTime: number;
  seatsTotal: number;
  price: string;
  preferences?: {
    smoking: boolean;
    pets: boolean;
    music: boolean;
    luggageSize: 'small' | 'medium' | 'large';
  };
}

interface SearchRideParams {
  origin: Location;
  destination: Location;
  departureTime: number;
  seats?: number;
}

export function useRides(): UseRidesReturn {
  const [rides, setRides] = useState<Ride[]>([]);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useWallet();
  const { user } = useAuth();

  const createRide = useCallback(async (params: CreateRideParams) => {
    if (!address || !user) {
      setError('Please connect your wallet and sign in to create a ride');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ride = await RideService.createRide({
        driver: address,
        pickup: params.pickup,
        destination: params.destination,
        departureTime: params.departureTime,
        seatsTotal: params.seatsTotal,
        price: {
          amount: params.price,
          currency: 'TON'
        },
        preferences: params.preferences
      });

      setRides(prev => [ride, ...prev]);
      setActiveRide(ride);
    } catch (err) {
      setError('Failed to create ride. Please try again.');
      console.error('Create ride error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, user]);

  const searchRides = useCallback(async (params: SearchRideParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const foundRides = await RideService.searchRides(params);
      setRides(foundRides);
    } catch (err) {
      setError('Failed to search rides. Please try again.');
      console.error('Search rides error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const bookRide = useCallback(async (rideId: string) => {
    if (!address || !user) {
      setError('Please connect your wallet and sign in to book a ride');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedRide = await RideService.bookRide(rideId, address);
      setRides(prev => prev.map(ride => 
        ride.id === updatedRide.id ? updatedRide : ride
      ));
      setActiveRide(updatedRide);
    } catch (err) {
      setError('Failed to book ride. Please try again.');
      console.error('Book ride error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, user]);

  const cancelRide = useCallback(async (rideId: string) => {
    if (!address || !user) {
      setError('Please connect your wallet and sign in to cancel a ride');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedRide = await RideService.cancelRide(rideId);
      setRides(prev => prev.map(ride => 
        ride.id === updatedRide.id ? updatedRide : ride
      ));
      if (activeRide?.id === rideId) {
        setActiveRide(updatedRide);
      }
    } catch (err) {
      setError('Failed to cancel ride. Please try again.');
      console.error('Cancel ride error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, user, activeRide]);

  const loadUserRides = useCallback(async () => {
    if (!address || !user) {
      setError('Please connect your wallet and sign in to view your rides');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userRides = await RideService.getUserRides(address);
      setRides(userRides);
    } catch (err) {
      setError('Failed to load your rides. Please try again.');
      console.error('Load user rides error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, user]);

  return {
    rides,
    activeRide,
    isLoading,
    error,
    createRide,
    searchRides,
    bookRide,
    cancelRide,
    loadUserRides
  };
}
