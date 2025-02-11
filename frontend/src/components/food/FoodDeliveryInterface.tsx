import { useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Restaurant, FoodOrder, CourierProfile } from '../../types/food';
import { mockRestaurants } from '../../mock/restaurants';
import { RestaurantCard } from './RestaurantCard';
import { RestaurantMenu } from './RestaurantMenu';
import { OrderTracking } from './OrderTracking';
import { PaymentModal } from './PaymentModal';
import { CourierDashboard } from './CourierDashboard';
import { RestaurantDashboard } from './RestaurantDashboard';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  mode: 'customer' | 'courier' | 'restaurant';
}

export const FoodDeliveryInterface = ({ mode }: Props) => {
  const router = useRouter();
  const { user, score, addScore } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [restaurants] = useState<Restaurant[]>(mockRestaurants);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<{
    items: { 
      item: {
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
      };
      quantity: number;
      options?: any[];
    }[];
    total: number;
  }>({ items: [], total: 0 });
  const [showPayment, setShowPayment] = useState(false);
  const [activeOrder, setActiveOrder] = useState<FoodOrder | null>(null);

  const handleAddToCart = useCallback((item: any, quantity: number, options?: any[]) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setCart(prev => ({
      items: [...prev.items, { item, quantity, options }],
      total: prev.total + item.price * quantity
    }));
  }, [user]);

  const handlePayment = useCallback(async (method: 'TON' | 'USDC' | 'card') => {
    if (!selectedRestaurant || !user) return;

    const orderTotal = cart.total;
    const earnedPoints = Math.floor(orderTotal * 10); // 10 points per dollar

    const newOrder: FoodOrder = {
      id: Date.now().toString(),
      restaurantId: selectedRestaurant.id,
      customerId: user.id,
      items: cart.items.map(({ item, quantity, options }) => ({
        itemId: item.id,
        quantity,
        options,
      })),
      status: 'confirmed',
      amount: orderTotal,
      deliveryFee: 5,
      tmapReward: user.walletAddress ? Math.floor(orderTotal * 0.1) : 0,
      paymentMethod: method,
      paymentStatus: 'completed',
      createdAt: new Date(),
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60000),
      deliveryAddress: {
        street: '123 Customer St',
        city: 'Paris',
        zipCode: '75001',
        coordinates: {
          lat: 48.8566,
          lng: 2.3522
        }
      }
    };

    addScore(earnedPoints);
    setActiveOrder(newOrder);
    setShowPayment(false);
    setCart({ items: [], total: 0 });
    setSelectedRestaurant(null);
  }, [addScore, cart.items, cart.total, selectedRestaurant, user]);

  const handleGoHome = useCallback(() => {
    router.push('/').catch(console.error);
  }, [router]);

  if (mode === 'courier') {
    return (
      <CourierDashboard
        profile={{
          id: '1',
          userId: user.id || '',
          status: 'available',
          currentLocation: {
            lat: 48.8566,
            lng: 2.3522
          },
          rating: 4.8,
          totalDeliveries: 156,
          vehicle: 'scooter',
          documents: [
            {
              type: 'id',
              verified: true,
              url: ''
            }
          ],
          earnings: {
            today: 85,
            week: 450,
            month: 1850
          }
        }}
        availableOrders={[
          {
            id: '1',
            restaurantId: '1',
            customerId: '123',
            items: [],
            status: 'confirmed',
            amount: 45.98,
            deliveryFee: 5,
            tmapReward: 10,
            paymentMethod: 'TON',
            paymentStatus: 'completed',
            createdAt: new Date(),
            estimatedDeliveryTime: new Date(Date.now() + 30 * 60000),
            deliveryAddress: {
              street: '123 Main St',
              city: 'Paris',
              zipCode: '75001',
              coordinates: {
                lat: 48.8584,
                lng: 2.3536
              }
            }
          }
        ]}
        onAcceptOrder={(orderId: string) => {
          // Update order status and assign courier
        }}
        onUpdateLocation={(lat: number, lng: number) => {
          // Update courier location
        }}
      />
    );
  }

  if (mode === 'restaurant') {
    return (
      <RestaurantDashboard
        restaurant={restaurants[0]}
        activeOrders={[
          {
            id: '1',
            restaurantId: '1',
            customerId: '123',
            items: [],
            status: 'confirmed',
            amount: 45.98,
            deliveryFee: 5,
            tmapReward: 10,
            paymentMethod: 'TON',
            paymentStatus: 'completed',
            createdAt: new Date(),
            estimatedDeliveryTime: new Date(Date.now() + 30 * 60000),
            deliveryAddress: {
              street: '123 Main St',
              city: 'Paris',
              zipCode: '75001',
              coordinates: {
                lat: 48.8584,
                lng: 2.3536
              }
            }
          }
        ]}
        onUpdateMenu={(menu) => {
          // Update restaurant menu
        }}
        onUpdateStatus={(orderId, status) => {
          // Update order status
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#17212B]">
      {/* Header with Telegram Logo */}
      <div className="bg-[#242F3D] p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <button onClick={handleGoHome} className="text-[#2AABEE] hover:text-[#2AABEE]/80">
            <Image
              src="/telegram-logo.svg"
              alt="Home"
              width={32}
              height={32}
              className="text-current"
            />
          </button>
          <h1 className="text-white font-semibold">TONmaps Food Delivery</h1>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-[#2AABEE] font-semibold">{score} points</span>
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 rounded-lg bg-[#2AABEE] text-white hover:bg-[#2AABEE]/80"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        {activeOrder ? (
          <OrderTracking order={activeOrder} />
        ) : selectedRestaurant ? (
          <>
            <button
              onClick={() => setSelectedRestaurant(null)}
              className="mb-4 px-4 py-2 rounded-lg bg-[#2AABEE]/20 text-[#2AABEE] hover:bg-[#2AABEE]/30"
            >
              ← Back to Restaurants
            </button>

            <RestaurantMenu
              restaurant={selectedRestaurant}
              onAddToCart={handleAddToCart}
            />

            {cart.items.length > 0 && (
              <div className="fixed bottom-0 left-0 right-0 bg-[#242F3D] p-4">
                <div className="container mx-auto flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">
                      {cart.items.length} items
                    </div>
                    <div className="text-[#2AABEE]">
                      Total: ${cart.total.toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPayment(true)}
                    className="px-6 py-3 rounded-lg bg-[#2AABEE] text-white hover:bg-[#2AABEE]/80"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Restaurants Near You
              </h2>
              {user && <Link href="/profile"><a><Image src={user.avatar} alt={user.name} width={32} height={32} className="rounded-full" /></a></Link>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map(restaurant => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={() => setSelectedRestaurant(restaurant)}
                />
              ))}
            </div>
          </div>
        )}

        {showPayment && cart.items.length > 0 && (
          <PaymentModal
            order={{
              id: '',
              restaurantId: selectedRestaurant?.id || '',
              customerId: user?.id || '',
              items: [],
              status: 'pending',
              amount: cart.total,
              deliveryFee: 5,
              tmapReward: user?.walletAddress ? Math.floor(cart.total * 0.1) : 0,
              paymentMethod: 'TON',
              paymentStatus: 'pending',
              createdAt: new Date(),
              deliveryAddress: {
                street: '',
                city: '',
                zipCode: '',
                coordinates: {
                  lat: 0,
                  lng: 0
                }
              }
            }}
            onClose={() => setShowPayment(false)}
            onPaymentComplete={handlePayment}
          />
        )}

        {showLogin && (
          <LoginModal onClose={() => setShowLogin(false)} />
        )}
      </div>
    </div>
  );
};
