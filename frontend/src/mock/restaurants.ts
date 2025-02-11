import { Restaurant } from '../types/food';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Le Bistrot Parisien',
    description: 'Authentic French cuisine in a cozy atmosphere',
    address: '123 Rue de la Paix, Paris',
    coordinates: {
      lat: 48.8566,
      lng: 2.3522
    },
    rating: 4.8,
    deliveryTime: '30-45',
    minOrder: 15,
    cuisine: 'French',
    image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092',
    isOpen: true,
    schedule: {
      monday: { open: '11:00', close: '23:00' },
      tuesday: { open: '11:00', close: '23:00' },
      wednesday: { open: '11:00', close: '23:00' },
      thursday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '00:00' },
      saturday: { open: '11:00', close: '00:00' },
      sunday: { open: '12:00', close: '22:00' }
    },
    menu: [
      {
        id: '1-1',
        name: 'Coq au Vin',
        description: 'Traditional French chicken braised with wine, mushrooms, and pearl onions',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092',
        category: 'Main Course',
        available: true
      },
      {
        id: '1-2',
        name: 'French Onion Soup',
        description: 'Classic soup with caramelized onions, beef broth, and melted cheese',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092',
        category: 'Starters',
        available: true
      }
    ]
  },
  {
    id: '2',
    name: 'Sushi Master',
    description: 'Premium sushi and Japanese specialties',
    address: '456 Sushi Street, Tokyo',
    coordinates: {
      lat: 35.6762,
      lng: 139.6503
    },
    rating: 4.9,
    deliveryTime: '20-35',
    minOrder: 20,
    cuisine: 'Japanese',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    isOpen: true,
    schedule: {
      monday: { open: '11:30', close: '22:00' },
      tuesday: { open: '11:30', close: '22:00' },
      wednesday: { open: '11:30', close: '22:00' },
      thursday: { open: '11:30', close: '22:00' },
      friday: { open: '11:30', close: '23:00' },
      saturday: { open: '11:30', close: '23:00' },
      sunday: { open: '12:00', close: '21:00' }
    },
    menu: [
      {
        id: '2-1',
        name: 'Dragon Roll',
        description: 'Eel, cucumber, avocado, topped with tobiko',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
        category: 'Rolls',
        available: true
      },
      {
        id: '2-2',
        name: 'Sashimi Deluxe',
        description: 'Chef\'s selection of premium raw fish',
        price: 32.99,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
        category: 'Sashimi',
        available: true
      }
    ]
  },
  {
    id: '3',
    name: 'Pizza Roma',
    description: 'Authentic Italian pizzas and pasta',
    address: '789 Via Roma, Rome',
    coordinates: {
      lat: 41.9028,
      lng: 12.4964
    },
    rating: 4.7,
    deliveryTime: '25-40',
    minOrder: 15,
    cuisine: 'Italian',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
    isOpen: true,
    schedule: {
      monday: { open: '12:00', close: '23:00' },
      tuesday: { open: '12:00', close: '23:00' },
      wednesday: { open: '12:00', close: '23:00' },
      thursday: { open: '12:00', close: '23:00' },
      friday: { open: '12:00', close: '00:00' },
      saturday: { open: '12:00', close: '00:00' },
      sunday: { open: '12:00', close: '23:00' }
    },
    menu: [
      {
        id: '3-1',
        name: 'Margherita Pizza',
        description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
        category: 'Pizza',
        available: true
      },
      {
        id: '3-2',
        name: 'Spaghetti Carbonara',
        description: 'Classic Roman pasta with eggs, pecorino cheese, guanciale, and black pepper',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
        category: 'Pasta',
        available: true
      }
    ]
  }
];
