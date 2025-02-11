import { useState } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { useTelegram } from '../../contexts/TelegramContext';
import Image from 'next/image';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { isConnected: isWalletConnected, balance } = useWallet();
  const { isConnected: isTelegramConnected } = useTelegram();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#2D2D2D] border-b border-[#E0E0E0] dark:border-[#404040] z-50">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-[#F5F5F5] dark:hover:bg-[#3D3D3D] rounded-lg transition-colors"
          >
            <span className="text-2xl">☰</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#007AFF] rounded-lg"></div>
            <span className="text-lg font-accent font-bold text-[#1E1E1E] dark:text-white">
              TonMaps
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Earnings Preview */}
          {isWalletConnected && (
            <div className="hidden sm:flex items-center space-x-2 bg-[#38D39F]/10 px-3 py-1.5 rounded-lg">
              <span className="text-[#38D39F] font-medium">+5.6 $TMAP</span>
              <span className="text-sm text-[#717171] dark:text-[#B3B3B3]">
                this week
              </span>
            </div>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-[#F5F5F5] dark:hover:bg-[#3D3D3D] rounded-lg transition-colors relative"
            >
              <span className="text-xl">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF8C42] rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-[#2D2D2D] rounded-xl shadow-lg border border-[#E0E0E0] dark:border-[#404040] p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Notifications</h3>
                  <button className="text-sm text-[#007AFF]">Mark all read</button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-xl mt-0.5">🚗</span>
                    <div>
                      <p className="text-sm">
                        Your ride to Central Park is confirmed!
                      </p>
                      <p className="text-xs text-[#717171] dark:text-[#B3B3B3] mt-1">
                        2 mins ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button className="p-2 hover:bg-[#F5F5F5] dark:hover:bg-[#3D3D3D] rounded-lg transition-colors">
            <span className="text-xl">🌙</span>
          </button>

          {/* User Menu */}
          <button className="flex items-center space-x-2 p-2 hover:bg-[#F5F5F5] dark:hover:bg-[#3D3D3D] rounded-lg transition-colors">
            <div className="w-8 h-8 bg-[#007AFF] rounded-full flex items-center justify-center">
              <span className="text-white font-medium">JD</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-[#717171] dark:text-[#B3B3B3]">
                {isTelegramConnected ? '@johndoe' : 'Connect Telegram'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
