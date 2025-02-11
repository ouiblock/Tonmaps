export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  options?: {
    name: string;
    choices: {
      name: string;
      price: number;
    }[];
  }[];
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  rating: number;
  reviewCount: number;
  priceRange: string;
  categories: string[];
  menu: MenuItem[];
  openingHours: {
    day: string;
    open: string;
    close: string;
  }[];
  isOpen: boolean;
  deliveryTime: number;
  deliveryFee: number;
}

export interface FoodOrder {
  id: string;
  restaurantId: string;
  customerId: string;
  courierId?: string;
  items: {
    itemId: string;
    quantity: number;
    options?: any[];
  }[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivering' | 'delivered' | 'cancelled';
  amount: number;
  deliveryFee: number;
  tmapReward: number;
  paymentMethod: 'TON' | 'USDC' | 'card';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  estimatedDeliveryTime?: Date;
  courierLocation?: {
    lat: number;
    lng: number;
  };
  deliveryAddress: {
    street: string;
    city: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    instructions?: string;
  };
}

export interface CourierProfile {
  id: string;
  userId: string;
  status: 'available' | 'busy' | 'offline';
  currentLocation: {
    lat: number;
    lng: number;
  };
  rating: number;
  totalDeliveries: number;
  vehicle: 'bicycle' | 'scooter' | 'car';
  documents: {
    type: string;
    verified: boolean;
    url: string;
  }[];
  earnings: {
    today: number;
    week: number;
    month: number;
  };
}
