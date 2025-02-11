import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

export interface CreateRideDTO {
  from: {
    address: string;
    latitude: number;
    longitude: number;
  };
  to: {
    address: string;
    latitude: number;
    longitude: number;
  };
  departureTime: string;
  seats: number;
  price: number;
  description?: string;
}

export interface CreateParcelDTO {
  from: {
    address: string;
    latitude: number;
    longitude: number;
  };
  to: {
    address: string;
    latitude: number;
    longitude: number;
  };
  deadline: string;
  size: 'small' | 'medium' | 'large';
  weight: number;
  reward: number;
  description?: string;
}

export const ridesApi = {
  create: async (data: CreateRideDTO) => {
    const response = await api.post('/rides', data);
    return response.data;
  },
  
  list: async () => {
    const response = await api.get('/rides');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/rides/${id}`);
    return response.data;
  },

  book: async (rideId: string, seats: number) => {
    const response = await api.post(`/rides/${rideId}/book`, { seats });
    return response.data;
  },
};

export const parcelsApi = {
  create: async (data: CreateParcelDTO) => {
    const response = await api.post('/parcels', data);
    return response.data;
  },

  list: async () => {
    const response = await api.get('/parcels');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/parcels/${id}`);
    return response.data;
  },

  accept: async (parcelId: string) => {
    const response = await api.post(`/parcels/${parcelId}/accept`);
    return response.data;
  },
};
