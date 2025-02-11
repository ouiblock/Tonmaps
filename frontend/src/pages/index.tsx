import { useState } from 'react';
import { useRouter } from 'next/router';

const services = [
  {
    id: 'ride',
    label: 'Find a Ride',
    icon: '🚗',
    href: '/carpooling/search',
    color: '#007AFF',
    description: 'Share rides and reduce carbon footprint',
  },
  {
    id: 'package',
    label: 'Send a Package',
    icon: '📦',
    href: '/parcel/send',
    color: '#38D39F',
    description: 'Fast and secure package delivery',
  },
  {
    id: 'food',
    label: 'Order Food',
    icon: '🍔',
    href: '/food/restaurants',
    color: '#FF8C42',
    description: 'Local restaurants delivered to you',
  },
];

export default function Home() {
  const router = useRouter();

  const handleServiceClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#1E1E1E]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1E1E1E] dark:text-white">
            Welcome to Onzrod
          </h1>
          <p className="mt-4 text-xl text-[#717171] dark:text-[#B3B3B3]">
            The decentralized mobility and delivery platform
          </p>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.href)}
                className="group p-6 bg-white dark:bg-[#2D2D2D] rounded-xl shadow-lg hover:shadow-xl transition-all"
                style={{ borderColor: service.color }}
              >
                <div className="flex flex-col items-center space-y-4">
                  <span className="text-4xl">{service.icon}</span>
                  <h3 
                    className="text-lg font-medium"
                    style={{ color: service.color }}
                  >
                    {service.label}
                  </h3>
                  <p className="text-[#717171] dark:text-[#B3B3B3] text-sm">
                    {service.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
