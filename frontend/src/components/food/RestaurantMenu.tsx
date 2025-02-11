import { useState } from 'react';
import { Restaurant, MenuItem } from '../../types/food';
import Image from 'next/image';

interface RestaurantMenuProps {
  restaurant: Restaurant;
  onAddToCart: (item: MenuItem, quantity: number, options?: MenuItem['options']) => void;
}

export const RestaurantMenu = ({ restaurant, onAddToCart }: RestaurantMenuProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const categories = ['all', ...new Set(restaurant.menu.map(item => item.category))];
  
  const filteredMenu = selectedCategory === 'all' 
    ? restaurant.menu 
    : restaurant.menu.filter(item => item.category === selectedCategory);

  return (
    <div className="bg-[#17212B] min-h-screen">
      {/* Categories */}
      <div className="sticky top-0 bg-[#242F3D] p-4 z-10">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-[#2AABEE] text-white'
                  : 'bg-[#2AABEE]/20 text-[#2AABEE] hover:bg-[#2AABEE]/30'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMenu.map(item => (
          <div
            key={item.id}
            className="bg-[#242F3D] p-4 rounded-xl flex items-start space-x-4"
          >
            <div className="relative w-24 h-24 flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-white">{item.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[#2AABEE] font-semibold">${item.price}</span>
                <button
                  onClick={() => setSelectedItem(item)}
                  className="px-4 py-2 rounded-lg bg-[#2AABEE] text-white hover:bg-[#2AABEE]/80 transition-colors"
                  disabled={!item.available}
                >
                  {item.available ? 'Add to Cart' : 'Not Available'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-20">
          <div className="bg-[#242F3D] rounded-xl p-6 max-w-md w-full">
            <div className="relative h-48 mb-4">
              <Image
                src={selectedItem.image}
                alt={selectedItem.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{selectedItem.name}</h3>
            <p className="text-gray-400 mb-4">{selectedItem.description}</p>
            
            {selectedItem.options?.map(option => (
              <div key={option.name} className="mb-4">
                <h4 className="text-white font-semibold mb-2">{option.name}</h4>
                <div className="space-y-2">
                  {option.choices.map(choice => (
                    <div
                      key={choice.name}
                      className="flex items-center justify-between text-gray-400"
                    >
                      <span>{choice.name}</span>
                      <span>+${choice.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onAddToCart(selectedItem, 1);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#2AABEE] text-white hover:bg-[#2AABEE]/80"
              >
                Add to Cart - ${selectedItem.price}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
