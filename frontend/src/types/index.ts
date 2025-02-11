export interface Location {
  name: string;
  lat: number;
  lng: number;
  address?: string;
  city?: string;
}

export interface User {
  address: string;
  telegramUsername: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  score: number;
  completedRides: number;
  completedDeliveries: number;
  rating: number;
  verificationLevel: number;
  joinedDate: number;
  languages: string[];
  preferences?: {
    smoking: boolean;
    pets: boolean;
    music: boolean;
    chat: boolean;
  };
}

export interface Ride {
  id: string;
  driver: string;
  passenger?: string;
  pickup: Location;
  destination: Location;
  status: 'pending' | 'accepted' | 'inProgress' | 'completed' | 'cancelled';
  price: {
    amount: string;
    currency: 'TON' | 'OZR' | 'USD';
  };
  seatsAvailable: number;
  seatsTotal: number;
  timestamp: number;
  departureTime: number;
  estimatedArrivalTime: number;
  paymentStatus: 'pending' | 'completed';
  description?: string;
  preferences?: {
    smoking: boolean;
    pets: boolean;
    music: boolean;
    luggageSize: 'small' | 'medium' | 'large';
  };
  stops?: Location[];
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    days?: number[];
  };
}

export interface RideListing {
  id: string;
  driver: string;
  origin: Location;
  destination: Location;
  departureTime: number;
  estimatedDuration: number;
  price: string;
  currency: string;
  seatsAvailable: number;
  preferences: RidePreferences;
  recurring: boolean;
}

export interface RidePreferences {
  smoking: boolean;
  pets: boolean;
  music: boolean;
}

export interface Delivery {
  id: string;
  sender: string;
  courier?: string;
  pickup: Location;
  destination: Location;
  status: 'pending' | 'accepted' | 'inProgress' | 'completed' | 'cancelled';
  price: {
    amount: string;
    currency: 'TON' | 'OZR' | 'USD';
  };
  timestamp: number;
  paymentStatus: 'pending' | 'completed';
  parcelSize: 'small' | 'medium' | 'large';
  weight: number;
  description?: string;
  insurance?: {
    amount: string;
    currency: 'TON' | 'OZR' | 'USD';
  };
  fragile: boolean;
  estimatedDeliveryTime?: number;
}

export interface Reward {
  id: string;
  userId: string;
  amount: string;
  type: 'ride' | 'delivery' | 'rating' | 'referral';
  timestamp: number;
  details?: string;
}

export interface Rating {
  id: string;
  fromUser: string;
  toUser: string;
  score: number;
  comment?: string;
  timestamp: number;
  rideId?: string;
  deliveryId?: string;
  aspects?: {
    punctuality: number;
    cleanliness: number;
    communication: number;
    driving?: number;
    accuracy?: number;
  };
}

export interface Message {
  id: string;
  fromUser: string;
  toUser: string;
  content: string;
  timestamp: number;
  read: boolean;
  rideId?: string;
  deliveryId?: string;
  type: 'text' | 'location' | 'payment' | 'system';
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  address: string;
  cuisine: string;
  image: string;
}

export interface DeliveryOrder {
  id: string;
  restaurantId: string;
  amount: number;
  status: 'pending' | 'accepted' | 'delivering' | 'completed';
  customerId: string;
  courierId?: string;
  createdAt: Date;
}
