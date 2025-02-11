import React from 'react';
import WalletConnect from './WalletConnect';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import NotificationCenter from './NotificationCenter';
import Chat from './Chat';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { address, userScore } = useWallet();
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#17212B]">
      {/* Header */}
      <header className="bg-[#242F3D] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.png"
                alt="Onzroad"
              />
              <h1 className="ml-3 text-xl font-bold text-gray-900">Onzroad</h1>
            </div>

            {/* User Info */}
            {user && (
              <div className="flex items-center space-x-6">
                {/* Notifications */}
                <NotificationCenter />

                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-white">{user.telegramUsername || user.name}</p>
                    <p className="text-sm text-gray-400">
                      Score: {userScore} TMAPS
                    </p>
                  </div>
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-10 w-10 rounded-full"
                    />
                  )}
                  <button
                    onClick={logout}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {new Date().getFullYear()} Onzroad. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="/terms"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Terms
              </a>
              <a
                href="/privacy"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Window */}
      {activeChatUser && (
        <Chat
          otherUserId={activeChatUser}
          onClose={() => setActiveChatUser(null)}
        />
      )}
    </div>
  );
};

export default Layout;
