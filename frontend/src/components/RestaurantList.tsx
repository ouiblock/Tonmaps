import { useState } from 'react';
import { Restaurant } from '../types';
import { useRestaurants } from '../hooks/useRestaurants';

interface RestaurantListProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export default function RestaurantList({ onSelectRestaurant }: RestaurantListProps) {
  const { restaurants, isLoading, error, searchRestaurants } = useRestaurants();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);

  const cuisines = [
    'Italian',
    'Japanese',
    'Chinese',
    'Mexican',
    'Indian',
    'American',
    'Thai',
    'Mediterranean',
  ];

  const handleSearch = async () => {
    await searchRestaurants({
      query: searchQuery,
      cuisine: selectedCuisine || undefined,
      rating: minRating || undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <div className="space-y-4">
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants..."
            className="w-full px-4 py-2 bg-[#1C2431] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AABEE]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full px-4 py-2 bg-[#1C2431] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AABEE]"
            >
              <option value="">All Cuisines</option>
              {cuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full px-4 py-2 bg-[#1C2431] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AABEE]"
            >
              <option value={0}>All Ratings</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="w-full px-4 py-2 bg-[#2AABEE] text-white rounded-lg hover:bg-[#2AABEE]/80 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2AABEE]"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : restaurants.length === 0 ? (
          <div className="text-gray-400 text-center py-4">
            No restaurants found
          </div>
        ) : (
          <div className="grid gap-4">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-[#1C2431] p-4 rounded-lg hover:bg-[#242F3D] transition-colors cursor-pointer"
                onClick={() => onSelectRestaurant(restaurant)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{restaurant.name}</h3>
                    <p className="text-gray-400 text-sm">{restaurant.cuisine}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-white">{restaurant.rating}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">{restaurant.deliveryTime}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      Min. order: {restaurant.minOrder} TON
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
