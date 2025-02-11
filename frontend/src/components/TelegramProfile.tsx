import { useState } from 'react';
import { useTelegram } from '../contexts/TelegramContext';
import { useAuth } from '../contexts/AuthContext';
import TelegramAuthButton from './TelegramAuthButton';

export default function TelegramProfile() {
  const { isConnected, username, disconnectTelegram, error } = useTelegram();
  const { user } = useAuth();
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const handleDisconnect = async () => {
    await disconnectTelegram();
    setShowDisconnectConfirm(false);
  };

  if (!user) return null;

  return (
    <div className="bg-[#242F3D] rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Telegram Connection</h2>

      {isConnected ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {user.avatar && (
              <img
                src={user.avatar}
                alt={username || ''}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <p className="text-white font-medium">@{username}</p>
              <p className="text-sm text-gray-400">Connected to Telegram</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href={`https://t.me/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#2AABEE] text-white rounded-lg hover:bg-[#2AABEE]/80 flex items-center space-x-2"
            >
              <img
                src="/telegram-logo-white.svg"
                alt=""
                className="w-5 h-5"
              />
              <span>Open Profile</span>
            </a>

            {!showDisconnectConfirm ? (
              <button
                onClick={() => setShowDisconnectConfirm(true)}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
              >
                Disconnect
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowDisconnectConfirm(false)}
                  className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}

          <div className="mt-4 p-4 bg-[#1C2431] rounded-lg">
            <h3 className="text-white font-medium mb-2">Connected Features</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Direct messaging with other users</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Ride notifications and updates</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Delivery status alerts</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Location sharing</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Payment confirmations</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-400">
            Connect your Telegram account to enable direct messaging, notifications,
            and other features.
          </p>

          <div className="flex flex-col items-start space-y-4">
            <TelegramAuthButton
              size="large"
              cornerRadius={8}
              requestAccess="write"
              showAvatar={true}
            />

            <div className="p-4 bg-[#1C2431] rounded-lg w-full">
              <h3 className="text-white font-medium mb-2">Available Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center space-x-2">
                  <span className="text-gray-500">○</span>
                  <span>Direct messaging with other users</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-gray-500">○</span>
                  <span>Ride notifications and updates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-gray-500">○</span>
                  <span>Delivery status alerts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-gray-500">○</span>
                  <span>Location sharing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-gray-500">○</span>
                  <span>Payment confirmations</span>
                </li>
              </ul>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
