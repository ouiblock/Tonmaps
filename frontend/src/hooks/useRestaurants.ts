import { useState, useCallback } from 'react';
import { Restaurant, DeliveryOrder } from '../types';
import RestaurantService from '../services/RestaurantService';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';

interface UseRestaurantsReturn {
  restaurants: Restaurant[];
  activeRestaurant: Restaurant | null;
  orders: DeliveryOrder[];
  activeOrder: DeliveryOrder | null;
  isLoading: boolean;
  error: string | null;
  searchRestaurants: (params: SearchRestaurantsParams) => Promise<void>;
  createOrder: (params: CreateOrderParams) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  loadUserOrders: () => Promise<void>;
}

interface SearchRestaurantsParams {
  query?: string;
  cuisine?: string;
  rating?: number;
  maxDeliveryTime?: number;
}

interface CreateOrderParams {
  restaurantId: string;
  items: Array<{
    id: string;
    quantity: number;
    specialInstructions?: string;
  }>;
  deliveryAddress: string;
  paymentMethod: 'TON' | 'TMAPS';
}

export function useRestaurants(): UseRestaurantsReturn {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [activeOrder, setActiveOrder] = useState<DeliveryOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useWallet();
  const { user } = useAuth();

  const searchRestaurants = useCallback(async (params: SearchRestaurantsParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const foundRestaurants = await RestaurantService.searchRestaurants(params);
      setRestaurants(foundRestaurants);
      if (foundRestaurants.length > 0) {
        setActiveRestaurant(foundRestaurants[0]);
      }
    } catch (err) {
      setError('Failed to search restaurants. Please try again.');
      console.error('Search restaurants error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (params: CreateOrderParams) => {
    if (!address || !user) {
      setError('Please connect your wallet and sign in to create an order');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const order = await RestaurantService.createOrder({
        ...params,
        customerId: address
      });

      setOrders(prev => [order, ...prev]);
      setActiveOrder(order);
    } catch (err) {
      setError('Failed to create order. Please try again.');
      console.error('Create order error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, user]);

  const cancelOrder = useCallback(async (orderId: string) => {
    if (!address || !user) {
      setError('Please connect your wallet and sign in to cancel an order');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedOrder = await RestaurantService.cancelOrder(orderId);
      setOrders(prev => prev.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      ));
      if (activeOrder?.id === orderId) {
        setActiveOrder(updatedOrder);
      }
    } catch (err) {
      setError('Failed to cancel order. Please try again.');
      console.error('Cancel order error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, user, activeOrder]);

  const loadUserOrders = useCallback(async () => {
    if (!address || !user) {
      setError('Please connect your wallet and sign in to view your orders');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userOrders = await RestaurantService.getUserOrders(address);
      setOrders(userOrders);
    } catch (err) {
      setError('Failed to load your orders. Please try again.');
      console.error('Load user orders error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, user]);

  return {
    restaurants,
    activeRestaurant,
    orders,
    activeOrder,
    isLoading,
    error,
    searchRestaurants,
    createOrder,
    cancelOrder,
    loadUserOrders
  };
}
