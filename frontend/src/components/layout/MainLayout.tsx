import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import TelegramLogo from '../icons/TelegramLogo';
import { ShoppingBagIcon, CalendarIcon } from '../icons';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const menuItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🚗', label: 'Rides', path: '/rides' },
    { icon: '🍽️', label: 'Food', path: '/food/restaurants' },
    { icon: '📦', label: 'Delivery', path: '/delivery' },
    { icon: '💬', label: 'Messages', path: '/messages' },
    { icon: '👤', label: 'Profile', path: '/profile' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(path);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar - Telegram Style */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-[#212121] transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <TelegramLogo className="w-8 h-8 text-[#0088CC]" />
              <span className="text-xl font-bold text-[#0088CC]">Onzrod</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActivePath(item.path)
                    ? 'bg-[#0088CC]/10 text-[#0088CC]'
                    : 'hover:bg-gray-100 dark:hover:bg-[#2D2D2D]'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            <Link
              href="/marketplace"
              className={`flex items-center space-x-2 p-2 rounded-lg ${
                router.pathname === '/marketplace'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ShoppingBagIcon className="w-6 h-6" />
              <span>Marketplace</span>
            </Link>
            <Link
              href="/marketplace/reservations"
              className={`flex items-center space-x-2 p-2 rounded-lg ${
                router.pathname === '/marketplace/reservations'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CalendarIcon className="w-6 h-6" />
              <span>My Reservations</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col min-h-screen">
        {/* Header - Uber Style */}
        <header className="sticky top-0 z-40 bg-white dark:bg-[#212121] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2D2D2D]"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <div className="ml-4 flex items-center space-x-2">
                  <TelegramLogo className="w-8 h-8 text-[#0088CC]" />
                  <span className="text-xl font-bold text-[#0088CC]">Onzrod</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2D2D2D]"
                >
                  {isDarkMode ? '🌞' : '🌙'}
                </button>
                <button className="px-4 py-2 bg-[#0088CC] text-white rounded-lg hover:bg-[#0088CC]/90 transition-colors">
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-[#F7F7F7] dark:bg-[#212121]">
          {children}
        </main>

        {/* Bottom Navigation - Mobile Only */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#212121] border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-5 h-16">
            {menuItems.slice(0, 5).map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center space-y-1 ${
                  isActivePath(item.path)
                    ? 'text-[#0088CC]'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
