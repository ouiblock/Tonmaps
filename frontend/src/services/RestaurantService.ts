import { Restaurant, DeliveryOrder } from '../types';

class RestaurantService {
  private static instance: RestaurantService;
  private baseUrl: string = '/api/restaurants';

  private constructor() {}

  public static getInstance(): RestaurantService {
    if (!RestaurantService.instance) {
      RestaurantService.instance = new RestaurantService();
    }
    return RestaurantService.instance;
  }

  async searchRestaurants(params: {
    query?: string;
    cuisine?: string;
    rating?: number;
    maxDeliveryTime?: number;
  }): Promise<Restaurant[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params.query) {
        queryParams.append('q', params.query);
      }
      if (params.cuisine) {
        queryParams.append('cuisine', params.cuisine);
      }
      if (params.rating) {
        queryParams.append('rating', params.rating.toString());
      }
      if (params.maxDeliveryTime) {
        queryParams.append('maxDeliveryTime', params.maxDeliveryTime.toString());
      }

      const response = await fetch(`${this.baseUrl}/search?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to search restaurants');
      }

      return response.json();
    } catch (error) {
      console.error('Error searching restaurants:', error);
      throw error;
    }
  }

  async getRestaurantById(id: string): Promise<Restaurant> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch restaurant');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      throw error;
    }
  }

  async createOrder(order: {
    restaurantId: string;
    customerId: string;
    items: Array<{
      id: string;
      quantity: number;
      specialInstructions?: string;
    }>;
    deliveryAddress: string;
    paymentMethod: 'TON' | 'TMAPS';
  }): Promise<DeliveryOrder> {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...order,
          status: 'pending',
          createdAt: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<DeliveryOrder> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async getUserOrders(userId: string): Promise<DeliveryOrder[]> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/user/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user orders');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  async updateOrderStatus(
    orderId: string,
    status: DeliveryOrder['status']
  ): Promise<DeliveryOrder> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      return response.json();
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async cancelOrder(orderId: string): Promise<DeliveryOrder> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      return response.json();
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  }
}

export default RestaurantService.getInstance();
