import { FoodOrder } from '../types/food';

export const mockOrders: FoodOrder[] = [
  {
    id: '1',
    restaurantId: '1',
    customerId: 'user1',
    courierId: 'courier1',
    items: [
      {
        itemId: '1-1',
        quantity: 2,
        specialInstructions: 'Extra sauce please'
      },
      {
        itemId: '1-2',
        quantity: 1
      }
    ],
    status: 'delivering',
    amount: 62.97,
    deliveryFee: 5,
    tmapReward: 6.3,
    paymentMethod: 'TON',
    paymentStatus: 'completed',
    createdAt: new Date('2025-02-05T11:30:00'),
    estimatedDeliveryTime: new Date('2025-02-05T12:15:00'),
    deliveryAddress: {
      street: '123 Customer St',
      city: 'Paris',
      zipCode: '75001',
      coordinates: {
        lat: 48.8584,
        lng: 2.3536
      },
      instructions: 'Ring bell 42'
    },
    courierLocation: {
      lat: 48.8566,
      lng: 2.3522,
      lastUpdate: new Date('2025-02-05T12:05:00')
    }
  },
  {
    id: '2',
    restaurantId: '2',
    customerId: 'user2',
    items: [
      {
        itemId: '2-1',
        quantity: 1,
        options: [
          {
            name: 'Spice Level',
            choice: 'Medium'
          }
        ]
      }
    ],
    status: 'confirmed',
    amount: 18.99,
    deliveryFee: 5,
    tmapReward: 1.9,
    paymentMethod: 'USDC',
    paymentStatus: 'completed',
    createdAt: new Date('2025-02-05T12:00:00'),
    estimatedDeliveryTime: new Date('2025-02-05T12:45:00'),
    deliveryAddress: {
      street: '456 Customer Ave',
      city: 'Paris',
      zipCode: '75002',
      coordinates: {
        lat: 48.8606,
        lng: 2.3376
      }
    }
  }
];
