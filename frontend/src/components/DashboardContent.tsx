import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from '../contexts/WalletContext';
import { useTelegram } from '../contexts/TelegramContext';

const quickActions = [
  {
    id: 'ride',
    label: 'Find a Ride',
    icon: '🚗',
    href: '/carpooling/search',
    color: '#007AFF',
    bgColor: '#007AFF10',
  },
  {
    id: 'package',
    label: 'Send a Package',
    icon: '📦',
    href: '/parcel/send',
    color: '#38D39F',
    bgColor: '#38D39F10',
  },
  {
    id: 'food',
    label: 'Order Food',
    icon: '🍔',
    href: '/food/restaurants',
    color: '#FF8C42',
    bgColor: '#FF8C4210',
  },
];

export default function DashboardContent() {
  const router = useRouter();
  const { isConnected: isWalletConnected } = useWallet();
  const { isConnected: isTelegramConnected } = useTelegram();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleActionClick = (href: string) => {
    router.push(href);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wallet Status */}
        <div className="bg-white dark:bg-[#2D2D2D] rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-medium mb-4">Wallet</h2>
          <div className="space-y-4">
            {isWalletConnected ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[#717171] dark:text-[#B3B3B3]">Balance</span>
                  <span className="font-medium">5.6 $OZR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#717171] dark:text-[#B3B3B3]">CO₂ Saved</span>
                  <span className="text-[#38D39F] font-medium">26kg 🌱</span>
                </div>
              </>
            ) : (
              <p className="text-center text-[#717171] dark:text-[#B3B3B3]">
                Connect your wallet to view balance
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-[#2D2D2D] rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action.href)}
                className="w-full flex items-center space-x-3 p-3 rounded-xl border-2 border-[#E0E0E0] dark:border-[#404040] hover:border-[#007AFF] dark:hover:border-[#007AFF] transition-colors"
                style={{ background: action.bgColor }}
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="font-medium" style={{ color: action.color }}>
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Telegram Status */}
        <div className="bg-white dark:bg-[#2D2D2D] rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-medium mb-4">Telegram</h2>
          {isTelegramConnected ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">💬</span>
                <p>Connected to Telegram</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-[#717171] dark:text-[#B3B3B3]">
                Connect your Telegram account
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
