import { User, RideListing } from '../types';

export const exampleUsers: User[] = [
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    displayName: 'Alex Driver',
    telegramUsername: 'alexdriver',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    bio: 'Professional driver with 5+ years experience',
    verificationLevel: 2,
    rating: 4.8,
    totalRides: 156,
    languages: ['English', 'French'],
    preferences: {
      smoking: false,
      pets: true,
      music: true,
      chat: true
    }
  },
  {
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    displayName: 'Sarah Rider',
    telegramUsername: 'sarahrider',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    bio: 'Daily commuter to Paris',
    verificationLevel: 1,
    rating: 4.5,
    totalRides: 42,
    languages: ['French', 'Spanish'],
    preferences: {
      smoking: false,
      pets: false,
      music: true,
      chat: true
    }
  }
];

export const exampleRides: RideListing[] = [
  {
    id: '1',
    driver: '0x1234567890abcdef1234567890abcdef12345678',
    origin: {
      name: 'Paris, France',
      lat: 48.8566,
      lng: 2.3522
    },
    destination: {
      name: 'Lyon, France',
      lat: 45.7578,
      lng: 4.8320
    },
    departureTime: new Date('2025-01-31T08:00:00').getTime(),
    estimatedDuration: 240,
    price: '50',
    currency: 'TON',
    seatsAvailable: 3,
    preferences: {
      smoking: false,
      pets: true,
      music: true
    },
    recurring: false
  },
  {
    id: '2',
    driver: '0xabcdef1234567890abcdef1234567890abcdef12',
    origin: {
      name: 'Marseille, France',
      lat: 43.2965,
      lng: 5.3698
    },
    destination: {
      name: 'Nice, France',
      lat: 43.7102,
      lng: 7.2620
    },
    departureTime: new Date('2025-01-31T10:00:00').getTime(),
    estimatedDuration: 120,
    price: '30',
    currency: 'TON',
    seatsAvailable: 2,
    preferences: {
      smoking: false,
      pets: false,
      music: true
    },
    recurring: false
  }
];
