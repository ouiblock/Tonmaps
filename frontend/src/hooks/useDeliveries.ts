import { useState, useCallback } from 'react';
import { Delivery, Location } from '../types';
import ParcelService from '../services/ParcelService';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';

interface UseDeliveriesReturn {
  deliveries: Delivery[];
  activeDelivery: Delivery | null;
  isLoading: boolean;
  error: string | null;
  createDelivery: (params: CreateDeliveryParams) => Promise<void>;
  searchDeliveries: (params: SearchDeliveryParams) => Promise<void>;
  acceptDelivery: (deliveryId: string) => Promise<void>;
  cancelDelivery: (deliveryId: string) => Promise<void>;
  loadUserDeliveries: (type?: 'sender' | 'courier') => Promise<void>;
}

interface CreateDeliveryParams {
  pickup: Location;
  destination: Location;
  price: string;
  parcelSize: 'small' | 'medium' | 'large';
  weight: number;
  description?: string;
  fragile: boolean;
  insurance?: {
    amount: string;
    currency: 'TON';
  };
}

interface SearchDeliveryParams {
  origin?: Location;
  destination?: Location;
  maxWeight?: number;
  parcelSize?: 'small' | 'medium' | 'large';
}

export function useDeliveries(): UseDeliveriesReturn {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [activeDelivery, setActiveDelivery] = useState<Delivery | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useWallet();
  const { user } = useAuth();

  const createDelivery = useCallback(async (params: CreateDeliveryParams) => {
    if (!address || !user) {
      setError('Please connect your wallet and sign in to create a delivery');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const delivery = await ParcelService.createDelivery({
        sender: address,
        pickup: params.pickup,
        destination: params.destination,
        price: {
          amount: params.price,
          currency: 'TON'
        },
        parcelSize: params.parcelSize,
        weight: params.weight,
        description: params.description,
        fragile: params.fragile,
        insurance: params.insurance
      });

      setDeliveries(prev => [delivery, ...prev]);
      setActiveDelivery(delivery);
    } catch (err) {
      setError('Failed to create delivery. Please try again.');
      console.error('Create delivery error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, user]);

  const searchDeliveries = useCallback(async (params: SearchDeliveryParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const foundDeliveries = await ParcelService.searchDeliveries(params);
      setDeliveries(foundDeliveries);
    } catch (err) {
      setError('Failed to search deliveries. Please try again.');
      console.error('Search deliveries error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acceptDelivery = useCallback(async (deliveryId: string) => {
    if (!address || !user) {
      setError('Please connect your wallet and sign in to accept a delivery');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedDelivery = await ParcelService.acceptDelivery(deliveryId, address);
      setDeliveries(prev => prev.map(delivery => 
        delivery.id === updatedDelivery.id ? updatedDelivery : delivery
      ));
      setActiveDelivery(updatedDelivery);
    } catch (err) {
      setError('Failed to accept delivery. Please try again.');
      console.error('Accept delivery error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, user]);

  const cancelDelivery = useCallback(async (deliveryId: string) => {
    if (!address || !user) {
      setError('Please connect your wallet and sign in to cancel a delivery');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedDelivery = await ParcelService.cancelDelivery(deliveryId);
      setDeliveries(prev => prev.map(delivery => 
        delivery.id === updatedDelivery.id ? updatedDelivery : delivery
      ));
      if (activeDelivery?.id === deliveryId) {
        setActiveDelivery(updatedDelivery);
      }
    } catch (err) {
      setError('Failed to cancel delivery. Please try again.');
      console.error('Cancel delivery error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, user, activeDelivery]);

  const loadUserDeliveries = useCallback(async (type: 'sender' | 'courier' = 'sender') => {
    if (!address || !user) {
      setError('Please connect your wallet and sign in to view your deliveries');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userDeliveries = await ParcelService.getUserDeliveries(address, type);
      setDeliveries(userDeliveries);
    } catch (err) {
      setError('Failed to load your deliveries. Please try again.');
      console.error('Load user deliveries error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, user]);

  return {
    deliveries,
    activeDelivery,
    isLoading,
    error,
    createDelivery,
    searchDeliveries,
    acceptDelivery,
    cancelDelivery,
    loadUserDeliveries
  };
}
