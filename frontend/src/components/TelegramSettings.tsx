import { useState } from 'react';
import { useTelegram } from '../contexts/TelegramContext';
import { useAuth } from '../contexts/AuthContext';
import TelegramAuthButton from './TelegramAuthButton';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  defaultEnabled: boolean;
}

const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    id: 'ride_updates',
    label: 'Ride Updates',
    description: 'Get notified about ride requests, status changes, and ETAs',
    defaultEnabled: true,
  },
  {
    id: 'delivery_updates',
    label: 'Delivery Updates',
    description: 'Receive updates about parcel pickups, deliveries, and tracking',
    defaultEnabled: true,
  },
  {
    id: 'order_updates',
    label: 'Order Updates',
    description: 'Get notifications about food orders, preparation, and delivery',
    defaultEnabled: true,
  },
  {
    id: 'payment_updates',
    label: 'Payment Updates',
    description: 'Receive payment confirmations and transaction updates',
    defaultEnabled: true,
  },
  {
    id: 'chat_messages',
    label: 'Chat Messages',
    description: 'Get notified about new messages from other users',
    defaultEnabled: true,
  },
  {
    id: 'promotions',
    label: 'Promotions & News',
    description: 'Stay updated with special offers and platform news',
    defaultEnabled: false,
  },
];

export default function TelegramSettings() {
  const { isConnected, username, error } = useTelegram();
  const { user } = useAuth();
  const [settings, setSettings] = useState<Record<string, boolean>>(() => {
    const savedSettings = localStorage.getItem('telegram_notification_settings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return NOTIFICATION_SETTINGS.reduce((acc, setting) => {
      acc[setting.id] = setting.defaultEnabled;
      return acc;
    }, {} as Record<string, boolean>);
  });

  const handleToggleSetting = (settingId: string) => {
    const newSettings = {
      ...settings,
      [settingId]: !settings[settingId],
    };
    setSettings(newSettings);
    localStorage.setItem('telegram_notification_settings', JSON.stringify(newSettings));
  };

  if (!user) return null;

  return (
    <div className="bg-[#242F3D] rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Telegram Notifications</h2>

      {isConnected ? (
        <div className="space-y-6">
          {/* Connected Status */}
          <div className="flex items-center space-x-3 bg-[#1C2431] p-4 rounded-lg">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div>
              <p className="text-white">Connected as @{username}</p>
              <p className="text-sm text-gray-400">
                Notifications will be sent to your Telegram account
              </p>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            {NOTIFICATION_SETTINGS.map((setting) => (
              <div
                key={setting.id}
                className="flex items-start justify-between p-4 bg-[#1C2431] rounded-lg"
              >
                <div className="flex-1">
                  <label
                    htmlFor={setting.id}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <p className="text-white font-medium">{setting.label}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {setting.description}
                      </p>
                    </div>
                  </label>
                </div>
                <div className="ml-4 flex items-center">
                  <button
                    id={setting.id}
                    onClick={() => handleToggleSetting(setting.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2AABEE] focus:ring-offset-2 focus:ring-offset-[#1C2431] ${
                      settings[setting.id] ? 'bg-[#2AABEE]' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings[setting.id] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Test Notification */}
          <div className="mt-6">
            <button
              onClick={() => {
                // Add test notification logic here
              }}
              className="w-full px-4 py-2 bg-[#2AABEE]/20 text-[#2AABEE] rounded-lg hover:bg-[#2AABEE]/30"
            >
              Send Test Notification
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-6">
            Connect your Telegram account to receive notifications about rides,
            deliveries, orders, and messages.
          </p>
          <TelegramAuthButton size="large" cornerRadius={8} />
          {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
        </div>
      )}

      {/* Privacy Info */}
      <div className="mt-8 p-4 bg-[#1C2431] rounded-lg">
        <h3 className="text-white font-medium mb-2">Privacy & Security</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start space-x-2">
            <span className="text-[#2AABEE]">•</span>
            <span>
              Your Telegram connection is end-to-end encrypted and secure
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-[#2AABEE]">•</span>
            <span>
              We never share your Telegram information with third parties
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-[#2AABEE]">•</span>
            <span>
              You can revoke access to Onzrod at any time through Telegram settings
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
