import { useState } from 'react';
import { Restaurant, MenuItem, FoodOrder } from '../../types/food';
import Image from 'next/image';

interface RestaurantDashboardProps {
  restaurant: Restaurant;
  activeOrders: FoodOrder[];
  onUpdateMenu: (menu: MenuItem[]) => void;
  onUpdateStatus: (orderId: string, status: FoodOrder['status']) => void;
}

export const RestaurantDashboard = ({
  restaurant,
  activeOrders,
  onUpdateMenu,
  onUpdateStatus
}: RestaurantDashboardProps) => {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(restaurant.menu.map(item => item.category))];
  
  const filteredMenu = selectedCategory === 'all'
    ? restaurant.menu
    : restaurant.menu.filter(item => item.category === selectedCategory);

  const handleSaveItem = (updatedItem: MenuItem) => {
    const newMenu = restaurant.menu.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    onUpdateMenu(newMenu);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-[#17212B] p-4">
      {/* Header */}
      <div className="bg-[#242F3D] rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">{restaurant.name}</h2>
            <p className="text-gray-400">{restaurant.address}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                restaurant.isOpen ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-gray-400">
              {restaurant.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#17212B] rounded-lg p-3">
            <div className="text-sm text-gray-400">Active Orders</div>
            <div className="text-lg font-bold text-white">
              {activeOrders.length}
            </div>
          </div>
          <div className="bg-[#17212B] rounded-lg p-3">
            <div className="text-sm text-gray-400">Menu Items</div>
            <div className="text-lg font-bold text-white">
              {restaurant.menu.length}
            </div>
          </div>
          <div className="bg-[#17212B] rounded-lg p-3">
            <div className="text-sm text-gray-400">Rating</div>
            <div className="text-lg font-bold text-white">
              ⭐ {restaurant.rating.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Active Orders */}
      <div className="bg-[#242F3D] rounded-xl p-4 mb-4">
        <h3 className="text-lg font-semibold text-white mb-4">Active Orders</h3>
        <div className="space-y-4">
          {activeOrders.map(order => (
            <div key={order.id} className="bg-[#17212B] rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-white font-semibold">
                    Order #{order.id.slice(-4)}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {order.items.length} items • ${order.amount}
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => onUpdateStatus(order.id, e.target.value as FoodOrder['status'])}
                  className="bg-[#242F3D] text-white rounded-lg px-3 py-2 border border-gray-700"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready for Pickup</option>
                </select>
              </div>

              <div className="space-y-2">
                {order.items.map((item, index) => {
                  const menuItem = restaurant.menu.find(m => m.id === item.itemId);
                  return (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {item.quantity}x {menuItem?.name}
                      </span>
                      <span className="text-white">
                        ${((menuItem?.price || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {activeOrders.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No active orders
            </div>
          )}
        </div>
      </div>

      {/* Menu Management */}
      <div className="bg-[#242F3D] rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Menu Management</h3>
          <button
            onClick={() => setEditingItem({
              id: Date.now().toString(),
              name: '',
              description: '',
              price: 0,
              image: '',
              category: '',
              available: true
            })}
            className="px-4 py-2 rounded-lg bg-[#2AABEE] text-white hover:bg-[#2AABEE]/80"
          >
            Add Item
          </button>
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-4 mb-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMenu.map(item => (
            <div
              key={item.id}
              className="bg-[#17212B] p-4 rounded-xl flex items-start space-x-4"
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
                <h4 className="text-lg font-semibold text-white">{item.name}</h4>
                <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#2AABEE] font-semibold">
                    ${item.price}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="px-3 py-1 rounded-lg bg-[#2AABEE]/20 text-[#2AABEE] hover:bg-[#2AABEE]/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        const newMenu = restaurant.menu.map(menuItem =>
                          menuItem.id === item.id
                            ? { ...menuItem, available: !menuItem.available }
                            : menuItem
                        );
                        onUpdateMenu(newMenu);
                      }}
                      className={`px-3 py-1 rounded-lg ${
                        item.available
                          ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                          : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                      }`}
                    >
                      {item.available ? 'Available' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#242F3D] rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingItem.id ? 'Edit Item' : 'Add New Item'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400">Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    name: e.target.value
                  })}
                  className="w-full bg-[#17212B] text-white rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-400">Description</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    description: e.target.value
                  })}
                  className="w-full bg-[#17212B] text-white rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-400">Price</label>
                <input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    price: parseFloat(e.target.value)
                  })}
                  className="w-full bg-[#17212B] text-white rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-400">Category</label>
                <input
                  type="text"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    category: e.target.value
                  })}
                  className="w-full bg-[#17212B] text-white rounded-lg px-3 py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-gray-400">Image URL</label>
                <input
                  type="text"
                  value={editingItem.image}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    image: e.target.value
                  })}
                  className="w-full bg-[#17212B] text-white rounded-lg px-3 py-2 mt-1"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveItem(editingItem)}
                className="flex-1 px-4 py-2 rounded-lg bg-[#2AABEE] text-white hover:bg-[#2AABEE]/80"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
