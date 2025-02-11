import { Restaurant } from '../../types/food';
import Image from 'next/image';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

export const RestaurantCard = ({ restaurant, onClick }: RestaurantCardProps) => {
  return (
    <div
      className="bg-[#242F3D] rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Currently Closed</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{restaurant.name}</h3>
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">⭐</span>
            <span className="text-white">{restaurant.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-2 line-clamp-2">
          {restaurant.description}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#2AABEE]">{restaurant.cuisine}</span>
          <span className="text-gray-400">{restaurant.deliveryTime} min</span>
        </div>
        
        <div className="mt-2 text-sm text-gray-400">
          Min. order: ${restaurant.minOrder}
        </div>
      </div>
    </div>
  );
};
