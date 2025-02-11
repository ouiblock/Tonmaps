import { ReactNode, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTelegram } from '../../contexts/TelegramContext';
import { useWallet } from '../../contexts/WalletContext';
import BottomNavigation from './BottomNavigation';
import TopBar from './TopBar';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const { isConnected: isTelegramConnected } = useTelegram();
  const { isConnected: isWalletConnected } = useWallet();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#1E1E1E] font-primary">
      {/* Top Bar */}
      <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="pb-20 md:pb-0 md:ml-0 pt-16">
        {/* Connection Status Bar */}
        {(!isTelegramConnected || !isWalletConnected) && (
          <div className="bg-[#007AFF]/10 dark:bg-[#007AFF]/20 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[#007AFF]">
                {!isTelegramConnected && !isWalletConnected
                  ? '🔗 Connect your accounts to start'
                  : !isTelegramConnected
                  ? '💬 Connect Telegram to chat'
                  : '👛 Connect wallet to earn rewards'}
              </span>
            </div>
            <button className="text-sm text-[#007AFF] hover:text-[#0056B3] font-medium">
              Connect Now
            </button>
          </div>
        )}

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#2D2D2D] border-t border-[#E0E0E0] dark:border-[#404040]">
        <BottomNavigation />
      </div>
    </div>
  );
}
