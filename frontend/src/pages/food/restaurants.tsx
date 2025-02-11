import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  categories: string[];
  priceLevel: number;
  reviews: Review[];
  isOpen: boolean;
  featuredItems: FeaturedItem[];
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  images?: string[];
}

interface FeaturedItem {
  name: string;
  price: number;
  image: string;
}

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: 'Burger House',
    image: '🍔',
    rating: 4.8,
    deliveryTime: '20-30',
    minOrder: 10,
    categories: ['Burgers', 'American', 'Fast Food'],
    priceLevel: 2,
    isOpen: true,
    reviews: [
      {
        id: 1,
        userName: 'Mike R.',
        rating: 5,
        comment: 'Best burgers in town! The cheese sauce is amazing.',
        date: '2025-02-01',
        likes: 12,
        images: ['burger1.jpg', 'burger2.jpg'],
      },
      {
        id: 2,
        userName: 'Sarah L.',
        rating: 4,
        comment: 'Great food but delivery was a bit slow.',
        date: '2025-02-03',
        likes: 5,
      },
    ],
    featuredItems: [
      { name: 'Classic Burger', price: 12.99, image: '🍔' },
      { name: 'Cheese Fries', price: 5.99, image: '🍟' },
      { name: 'Milkshake', price: 4.99, image: '🥤' },
    ],
  },
  {
    id: 2,
    name: 'Pizza Palace',
    image: '🍕',
    rating: 4.6,
    deliveryTime: '25-35',
    minOrder: 15,
    categories: ['Pizza', 'Italian', 'Vegetarian'],
    priceLevel: 2,
    isOpen: true,
    reviews: [
      {
        id: 3,
        userName: 'John D.',
        rating: 5,
        comment: 'Authentic Italian pizza, crispy crust!',
        date: '2025-02-04',
        likes: 8,
        images: ['pizza1.jpg'],
      },
    ],
    featuredItems: [
      { name: 'Margherita', price: 14.99, image: '🍕' },
      { name: 'Garlic Bread', price: 4.99, image: '🥖' },
      { name: 'Tiramisu', price: 6.99, image: '🍰' },
    ],
  },
  {
    id: 3,
    name: 'Sushi Bar',
    image: '🍱',
    rating: 4.9,
    deliveryTime: '30-40',
    minOrder: 20,
    categories: ['Japanese', 'Sushi', 'Asian'],
    priceLevel: 3,
    isOpen: false,
    reviews: [
      {
        id: 4,
        userName: 'Emma W.',
        rating: 5,
        comment: 'Fresh fish, beautiful presentation!',
        date: '2025-02-02',
        likes: 15,
        images: ['sushi1.jpg', 'sushi2.jpg'],
      },
    ],
    featuredItems: [
      { name: 'California Roll', price: 16.99, image: '🍣' },
      { name: 'Miso Soup', price: 3.99, image: '🥣' },
      { name: 'Green Tea', price: 2.99, image: '🍵' },
    ],
  },
];

export default function Restaurants() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showReviews, setShowReviews] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const categories = ['All', ...Array.from(new Set(restaurants.flatMap(r => r.categories)))];
  const filteredRestaurants = selectedCategory === 'All'
    ? restaurants
    : restaurants.filter(r => r.categories.includes(selectedCategory));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold">Restaurants</h1>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search restaurants..."
              className="px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#2D2D2D]"
            />
            <select className="px-4 py-2 rounded-lg border border-[#E0E0E0] dark:border-[#404040] bg-white dark:bg-[#2D2D2D]">
              <option value="">Sort by</option>
              <option value="rating">Rating</option>
              <option value="delivery">Delivery Time</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>

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

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white dark:bg-[#2D2D2D] rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-4xl mb-2 block">{restaurant.image}</span>
                    <h3 className="text-lg font-medium">{restaurant.name}</h3>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-[#FFB800]">⭐</span>
                      <span className="font-medium">{restaurant.rating}</span>
                      <button
                        onClick={() => setShowReviews(showReviews === restaurant.id ? null : restaurant.id)}
                        className="text-sm text-[#007AFF] hover:underline ml-2"
                      >
                        {restaurant.reviews.length} reviews
                      </button>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-[#717171] dark:text-[#B3B3B3]">{restaurant.deliveryTime} min</p>
                    <p className="text-[#717171] dark:text-[#B3B3B3]">
                      Min. ${restaurant.minOrder}
                    </p>
                    <p className="mt-1">
                      {'💰'.repeat(restaurant.priceLevel)}
                    </p>
                  </div>
                </div>

                {showReviews === restaurant.id && (
                  <div className="mt-4 space-y-4">
                    {restaurant.reviews.map(review => (
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
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {restaurant.categories.map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 text-xs rounded-full bg-[#FF8C42]/10 text-[#FF8C42]"
                    >
                      {category}
                    </span>
                  ))}
                </div>

                {/* Featured Items */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Popular Items</h4>
                  <div className="flex space-x-4 overflow-x-auto pb-2">
                    {restaurant.featuredItems.map((item, index) => (
                      <div key={index} className="flex-shrink-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{item.image}</span>
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-sm text-[#717171] dark:text-[#B3B3B3]">
                              ${item.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <span className={`text-sm ${
                    restaurant.isOpen 
                      ? 'text-[#38D39F]' 
                      : 'text-[#FF6B6B]'
                  }`}>
                    {restaurant.isOpen ? '● Open Now' : '● Closed'}
                  </span>
                  <button
                    onClick={() => router.push(`/food/${restaurant.id}/menu`)}
                    className="px-4 py-2 bg-[#007AFF] text-white rounded-lg font-medium hover:bg-[#0056B3] transition-colors"
                  >
                    View Menu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
