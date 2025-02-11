import { Delivery, Location } from '../types';

class ParcelService {
  private static instance: ParcelService;
  private baseUrl: string = '/api/deliveries';

  private constructor() {}

  public static getInstance(): ParcelService {
    if (!ParcelService.instance) {
      ParcelService.instance = new ParcelService();
    }
    return ParcelService.instance;
  }

  async createDelivery(delivery: {
    sender: string;
    pickup: Location;
    destination: Location;
    price: {
      amount: string;
      currency: 'TON';
    };
    parcelSize: 'small' | 'medium' | 'large';
    weight: number;
    description?: string;
    fragile: boolean;
    insurance?: {
      amount: string;
      currency: 'TON';
    };
  }): Promise<Delivery> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...delivery,
          status: 'pending',
          timestamp: Date.now(),
          paymentStatus: 'pending',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create delivery');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating delivery:', error);
      throw error;
    }
  }

  async searchDeliveries(params: {
    origin?: Location;
    destination?: Location;
    maxWeight?: number;
    parcelSize?: 'small' | 'medium' | 'large';
  }): Promise<Delivery[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params.origin) {
        queryParams.append('originLat', params.origin.lat.toString());
        queryParams.append('originLng', params.origin.lng.toString());
      }
      if (params.destination) {
        queryParams.append('destLat', params.destination.lat.toString());
        queryParams.append('destLng', params.destination.lng.toString());
      }
      if (params.maxWeight) {
        queryParams.append('maxWeight', params.maxWeight.toString());
      }
      if (params.parcelSize) {
        queryParams.append('parcelSize', params.parcelSize);
      }

      const response = await fetch(`${this.baseUrl}/search?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to search deliveries');
      }

      return response.json();
    } catch (error) {
      console.error('Error searching deliveries:', error);
      throw error;
    }
  }

  async acceptDelivery(deliveryId: string, courierId: string): Promise<Delivery> {
    try {
      const response = await fetch(`${this.baseUrl}/${deliveryId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courierId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to accept delivery');
      }

      return response.json();
    } catch (error) {
      console.error('Error accepting delivery:', error);
      throw error;
    }
  }

  async updateDeliveryStatus(
    deliveryId: string,
    status: Delivery['status']
  ): Promise<Delivery> {
    try {
      const response = await fetch(`${this.baseUrl}/${deliveryId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update delivery status');
      }

      return response.json();
    } catch (error) {
      console.error('Error updating delivery status:', error);
      throw error;
    }
  }

  async getUserDeliveries(userId: string, type: 'sender' | 'courier' = 'sender'): Promise<Delivery[]> {
    try {
      const response = await fetch(`${this.baseUrl}/user/${userId}?type=${type}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user deliveries');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching user deliveries:', error);
      throw error;
    }
  }

  async cancelDelivery(deliveryId: string): Promise<Delivery> {
    try {
      const response = await fetch(`${this.baseUrl}/${deliveryId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel delivery');
      }

      return response.json();
    } catch (error) {
      console.error('Error canceling delivery:', error);
      throw error;
    }
  }
}

export default ParcelService.getInstance();
