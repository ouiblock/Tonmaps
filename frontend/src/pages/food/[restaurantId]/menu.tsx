import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  spicyLevel?: number;
  dietaryInfo?: string[];
  rating: number;
  reviews: Review[];
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  images?: string[];
}

interface Driver {
  id: string;
  name: string;
  photo: string;
  rating: number;
  deliveries: number;
  vehicle: string;
  estimatedTime: string;
  status: 'available' | 'delivering' | 'offline';
}

const mockMenu: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Angus beef patty with lettuce, tomato, onion, and our special sauce',
    price: 12.99,
    image: '🍔',
    category: 'Burgers',
    dietaryInfo: ['Contains gluten', 'Contains dairy'],
    rating: 4.8,
    reviews: [
      {
        id: '1',
        userName: 'John D.',
        rating: 5,
        comment: 'Best burger in town! The meat is perfectly cooked and juicy.',
        date: '2025-02-01',
        likes: 12,
        images: ['burger1.jpg'],
      },
    ],
  },
  {
    id: '2',
    name: 'Spicy Chicken Wings',
    description: 'Crispy wings tossed in our signature hot sauce',
    price: 10.99,
    image: '🍗',
    category: 'Appetizers',
    spicyLevel: 3,
    rating: 4.6,
    reviews: [
      {
        id: '2',
        userName: 'Sarah M.',
        rating: 4,
        comment: 'Really spicy but delicious! Great crispy texture.',
        date: '2025-02-03',
        likes: 8,
      },
    ],
  },
];

const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Alex Martin',
    photo: '👨',
    rating: 4.9,
    deliveries: 1243,
    vehicle: '🛵 Electric Scooter',
    estimatedTime: '15-20',
    status: 'available',
  },
  {
    id: '2',
    name: 'Marie Chen',
    photo: '👩',
    rating: 4.8,
    deliveries: 892,
    vehicle: '🚲 E-Bike',
    estimatedTime: '20-25',
    status: 'available',
  },
  {
    id: '3',
    name: 'Tom Wilson',
    photo: '👨',
    rating: 4.7,
    deliveries: 567,
    vehicle: '🛵 Scooter',
    estimatedTime: '25-30',
    status: 'available',
  },
];

export default function RestaurantMenu() {
  const router = useRouter();
  const { restaurantId } = router.query;
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showReviews, setShowReviews] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const categories = ['All', ...Array.from(new Set(mockMenu.map(item => item.category)))];
  const filteredMenu = selectedCategory === 'All' 
    ? mockMenu 
    : mockMenu.filter(item => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.item.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => 
      prev.map(i => 
        i.item.id === itemId 
          ? { ...i, quantity }
          : i
      )
    );
  };

  const totalAmount = cart.reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Categories */}
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-[#007AFF] text-white'
                    : 'bg-[#F5F5F5] dark:bg-[#3D3D3D] text-[#717171] dark:text-[#B3B3B3]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div className="grid gap-6">
            {filteredMenu.map(item => (
              <div key={item.id} className="bg-white dark:bg-[#2D2D2D] rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl">{item.image}</span>
                      <div>
                        <h3 className="text-lg font-medium">{item.name}</h3>
                        <p className="text-[#717171] dark:text-[#B3B3B3] mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.dietaryInfo?.map(info => (
                        <span
                          key={info}
                          className="px-2 py-1 text-xs rounded-full bg-[#38D39F]/10 text-[#38D39F]"
                        >
                          {info}
                        </span>
                      ))}
                      {item.spicyLevel && (
                        <span className="px-2 py-1 text-xs rounded-full bg-[#FF6B6B]/10 text-[#FF6B6B]">
                          {'🌶️'.repeat(item.spicyLevel)}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-[#FFB800]">⭐</span>
                        <span className="font-medium">{item.rating}</span>
                        <button
                          onClick={() => setShowReviews(showReviews === item.id ? null : item.id)}
                          className="text-sm text-[#007AFF] hover:underline"
                        >
                          {item.reviews.length} reviews
                        </button>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">${item.price.toFixed(2)}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="px-4 py-2 bg-[#007AFF] text-white rounded-lg hover:bg-[#0056B3] transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>

                    {showReviews === item.id && (
                      <div className="mt-4 space-y-4">
                        <h4 className="font-medium">Reviews</h4>
                        {item.reviews.map(review => (
                          <div
                            key={review.id}
                            className="p-4 bg-[#F5F5F5] dark:bg-[#3D3D3D] rounded-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{review.userName}</span>
                                <span className="text-[#FFB800]">
                                  {'⭐'.repeat(review.rating)}
                                </span>
                              </div>
                              <span className="text-sm text-[#717171] dark:text-[#B3B3B3]">
                                {review.date}
                              </span>
                            </div>
                            <p className="mt-2">{review.comment}</p>
                            {review.images && (
                              <div className="mt-2 flex space-x-2">
                                {review.images.map((image, index) => (
                                  <div
                                    key={index}
                                    className="w-16 h-16 bg-[#E0E0E0] dark:bg-[#4D4D4D] rounded-lg"
                                  />
                                ))}
                              </div>
                            )}
                            <div className="mt-2 flex items-center space-x-2">
                              <button className="text-[#007AFF] text-sm hover:underline">
                                👍 Helpful ({review.likes})
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart and Delivery Section */}
        <div className="space-y-6">
          {/* Cart */}
          <div className="bg-white dark:bg-[#2D2D2D] rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-medium mb-4">Your Order</h2>
            {cart.length === 0 ? (
              <p className="text-[#717171] dark:text-[#B3B3B3]">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.map(({ item, quantity }) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{item.image}</span>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-[#717171] dark:text-[#B3B3B3]">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F5] dark:bg-[#3D3D3D]"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F5F5] dark:bg-[#3D3D3D]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
                <div className="border-t border-[#E0E0E0] dark:border-[#404040] pt-4 mt-4">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Available Drivers */}
          {cart.length > 0 && (
            <div className="bg-white dark:bg-[#2D2D2D] rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-medium mb-4">Available Drivers</h2>
              <div className="space-y-4">
                {mockDrivers.map(driver => (
                  <button
                    key={driver.id}
                    onClick={() => setSelectedDriver(driver)}
                    className={`w-full p-4 rounded-lg border-2 transition-colors ${
                      selectedDriver?.id === driver.id
                        ? 'border-[#007AFF] bg-[#007AFF]/5'
                        : 'border-[#E0E0E0] dark:border-[#404040] hover:border-[#007AFF]'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{driver.photo}</span>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{driver.name}</h3>
                          <span className="text-sm">{driver.estimatedTime} min</span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-[#717171] dark:text-[#B3B3B3]">
                          <span>{driver.vehicle}</span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            ⭐ {driver.rating} ({driver.deliveries})
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Checkout Button */}
          {cart.length > 0 && (
            <button
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                selectedDriver
                  ? 'bg-[#007AFF] text-white hover:bg-[#0056B3]'
                  : 'bg-[#E0E0E0] dark:bg-[#404040] text-[#717171] dark:text-[#B3B3B3] cursor-not-allowed'
              }`}
              disabled={!selectedDriver}
            >
              {selectedDriver ? 'Place Order' : 'Select a Driver'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
