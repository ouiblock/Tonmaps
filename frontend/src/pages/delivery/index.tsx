import { useState } from 'react';
import { useRouter } from 'next/router';
import DateTimePicker from '../../components/DateTimePicker';

export default function DeliveryPage() {
  const router = useRouter();
  const [deliveryType, setDeliveryType] = useState('package');
  const [deliveryTime, setDeliveryTime] = useState<Date | null>(null);

  const deliveryOptions = [
    {
      type: 'package',
      icon: '📦',
      title: 'Package Delivery',
      description: 'Send packages across the city',
    },
    {
      type: 'food',
      icon: '🍽️',
      title: 'Food Delivery',
      description: 'Order from your favorite restaurants',
    },
    {
      type: 'grocery',
      icon: '🛒',
      title: 'Grocery Delivery',
      description: 'Get groceries delivered to your door',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Delivery</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Fast and secure delivery services
        </p>
      </div>

      {/* Delivery Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {deliveryOptions.map((option) => (
          <button
            key={option.type}
            onClick={() => setDeliveryType(option.type)}
            className={`card-uber text-left transition-all ${
              deliveryType === option.type
                ? 'ring-2 ring-[#0088CC]'
                : 'hover:scale-105'
            }`}
          >
            <span className="text-4xl mb-4 block">{option.icon}</span>
            <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {option.description}
            </p>
          </button>
        ))}
      </div>

      {/* Delivery Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card-uber">
          <h2 className="text-xl font-semibold mb-6">Delivery Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pickup Address</label>
              <input
                type="text"
                placeholder="Enter pickup address"
                className="input-uber"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Address</label>
              <input
                type="text"
                placeholder="Enter delivery address"
                className="input-uber"
              />
            </div>
            {deliveryType === 'package' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Package Size</label>
                  <select className="input-uber">
                    <option>Small (up to 5kg)</option>
                    <option>Medium (up to 15kg)</option>
                    <option>Large (up to 30kg)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Package Type</label>
                  <input
                    type="text"
                    placeholder="What are you sending?"
                    className="input-uber"
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Time</label>
              <DateTimePicker
                selectedDate={deliveryTime}
                onChange={setDeliveryTime}
                isDelivery={true}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Additional Notes</label>
              <textarea
                rows={3}
                placeholder="Any special instructions?"
                className="input-uber"
              />
            </div>
            <button className="btn-telegram w-full">
              Get Delivery Quote
            </button>
          </div>
        </div>

        {/* Map Preview */}
        <div className="card-uber h-[600px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <p className="text-gray-500">Map Preview</p>
        </div>
      </div>
    </div>
  );
}
