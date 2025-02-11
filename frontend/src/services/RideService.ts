import { Ride, Location } from '../types';

class RideService {
  private static instance: RideService;
  private baseUrl: string = '/api/rides';

  private constructor() {}

  public static getInstance(): RideService {
    if (!RideService.instance) {
      RideService.instance = new RideService();
    }
    return RideService.instance;
  }

  async createRide(ride: {
    driver: string;
    pickup: Location;
    destination: Location;
    departureTime: number;
    seatsTotal: number;
    price: {
      amount: string;
      currency: 'TON';
    };
    preferences?: {
      smoking: boolean;
      pets: boolean;
      music: boolean;
      luggageSize: 'small' | 'medium' | 'large';
    };
  }): Promise<Ride> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...ride,
          status: 'pending',
          seatsAvailable: ride.seatsTotal,
          timestamp: Date.now(),
          paymentStatus: 'pending',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create ride');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating ride:', error);
      throw error;
    }
  }

  async searchRides(params: {
    origin: Location;
    destination: Location;
    departureTime: number;
    seats?: number;
  }): Promise<Ride[]> {
    try {
      const queryParams = new URLSearchParams({
        originLat: params.origin.lat.toString(),
        originLng: params.origin.lng.toString(),
        destLat: params.destination.lat.toString(),
        destLng: params.destination.lng.toString(),
        departureTime: params.departureTime.toString(),
        ...(params.seats && { seats: params.seats.toString() }),
      });

      const response = await fetch(`${this.baseUrl}/search?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to search rides');
      }

      return response.json();
    } catch (error) {
      console.error('Error searching rides:', error);
      throw error;
    }
  }

  async bookRide(rideId: string, passengerId: string): Promise<Ride> {
    try {
      const response = await fetch(`${this.baseUrl}/${rideId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passengerId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to book ride');
      }

      return response.json();
    } catch (error) {
      console.error('Error booking ride:', error);
      throw error;
    }
  }

  async getRideById(rideId: string): Promise<Ride> {
    try {
      const response = await fetch(`${this.baseUrl}/${rideId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch ride');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching ride:', error);
      throw error;
    }
  }

  async getUserRides(userId: string, status?: Ride['status']): Promise<Ride[]> {
    try {
      const queryParams = new URLSearchParams({
        userId,
        ...(status && { status }),
      });

      const response = await fetch(`${this.baseUrl}/user?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user rides');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching user rides:', error);
      throw error;
    }
  }

  async updateRideStatus(
    rideId: string,
    status: Ride['status']
  ): Promise<Ride> {
    try {
      const response = await fetch(`${this.baseUrl}/${rideId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update ride status');
      }

      return response.json();
    } catch (error) {
      console.error('Error updating ride status:', error);
      throw error;
    }
  }

  async cancelRide(rideId: string): Promise<Ride> {
    try {
      const response = await fetch(`${this.baseUrl}/${rideId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel ride');
      }

      return response.json();
    } catch (error) {
      console.error('Error canceling ride:', error);
      throw error;
    }
  }
}

export default RideService.getInstance();
