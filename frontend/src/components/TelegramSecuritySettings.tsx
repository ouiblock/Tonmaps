import { useState } from 'react';
import { useTelegram } from '../contexts/TelegramContext';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';

interface SecuritySetting {
  id: string;
  label: string;
  description: string;
  defaultEnabled: boolean;
  required?: boolean;
}

const SECURITY_SETTINGS: SecuritySetting[] = [
  {
    id: 'two_factor',
    label: 'Two-Factor Authentication',
    description: 'Require Telegram confirmation for sensitive operations',
    defaultEnabled: true,
    required: true,
  },
  {
    id: 'location_privacy',
    label: 'Location Privacy',
    description: 'Only share precise location during active rides/deliveries',
    defaultEnabled: true,
  },
  {
    id: 'payment_confirmation',
    label: 'Payment Confirmation',
    description: 'Require Telegram confirmation for payments above 100 TMAP',
    defaultEnabled: true,
  },
  {
    id: 'chat_privacy',
    label: 'Chat Privacy',
    description: 'Only allow messages from verified users',
    defaultEnabled: true,
  },
  {
    id: 'data_encryption',
    label: 'End-to-End Encryption',
    description: 'Enable additional encryption for all messages',
    defaultEnabled: true,
    required: true,
  },
  {
    id: 'session_alerts',
    label: 'Security Alerts',
    description: 'Get notified of new device logins and security events',
    defaultEnabled: true,
  },
];

export default function TelegramSecuritySettings() {
  const { isConnected, username, error } = useTelegram();
  const { user } = useAuth();
  const [settings, setSettings] = useState<Record<string, boolean>>(() => {
    const savedSettings = localStorage.getItem('telegram_security_settings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return SECURITY_SETTINGS.reduce((acc, setting) => {
      acc[setting.id] = setting.defaultEnabled;
      return acc;
    }, {} as Record<string, boolean>);
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const handleToggleSetting = (settingId: string) => {
    const setting = SECURITY_SETTINGS.find(s => s.id === settingId);
    if (setting?.required) return;

    const newSettings = {
      ...settings,
      [settingId]: !settings[settingId],
    };
    setSettings(newSettings);
    localStorage.setItem('telegram_security_settings', JSON.stringify(newSettings));
  };

  const handleResetSettings = () => {
    const defaultSettings = SECURITY_SETTINGS.reduce((acc, setting) => {
      acc[setting.id] = setting.defaultEnabled;
      return acc;
    }, {} as Record<string, boolean>);
    setSettings(defaultSettings);
    localStorage.setItem('telegram_security_settings', JSON.stringify(defaultSettings));
    setShowResetConfirm(false);
  };

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 shadow-lg font-primary">
      <h2 className="text-2xl font-accent font-bold text-[#1E1E1E] dark:text-white mb-6">
        Security Settings
      </h2>

      {isConnected ? (
        <div className="space-y-6">
          {/* Security Status */}
          <div className="flex items-center space-x-3 bg-[#F5F5F5] dark:bg-[#2D2D2D] p-4 rounded-lg border border-[#E0E0E0] dark:border-[#404040]">
            <div className="w-3 h-3 bg-[#38D39F] rounded-full"></div>
            <div>
              <p className="text-[#1E1E1E] dark:text-white">
                Secure Connection Active
              </p>
              <p className="text-sm text-[#717171] dark:text-[#B3B3B3]">
                End-to-end encrypted connection with @{username}
              </p>
            </div>
          </div>

          {/* Security Settings */}
          <div className="space-y-4">
            {SECURITY_SETTINGS.map((setting) => (
              <div
                key={setting.id}
                className="flex items-start justify-between p-4 bg-[#F5F5F5] dark:bg-[#2D2D2D] rounded-lg border border-[#E0E0E0] dark:border-[#404040]"
              >
                <div className="flex-1">
                  <label
                    htmlFor={setting.id}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-[#1E1E1E] dark:text-white font-medium">
                          {setting.label}
                        </p>
                        {setting.required && (
                          <span className="text-xs text-[#007AFF] font-medium">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#717171] dark:text-[#B3B3B3] mt-1">
                        {setting.description}
                      </p>
                    </div>
                  </label>
                </div>
                <div className="ml-4 flex items-center">
                  <button
                    id={setting.id}
                    onClick={() => handleToggleSetting(setting.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:ring-offset-2 focus:ring-offset-[#F5F5F5] dark:focus:ring-offset-[#2D2D2D] ${
                      settings[setting.id]
                        ? 'bg-[#007AFF]'
                        : 'bg-[#E0E0E0] dark:bg-[#404040]'
                    } ${setting.required ? 'cursor-not-allowed opacity-80' : ''}`}
                    disabled={setting.required}
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

          {/* Actions */}
          <div className="space-y-4">
            {/* Reset Settings */}
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full px-4 py-2 bg-[#007AFF]/10 text-[#007AFF] rounded-lg hover:bg-[#007AFF]/20 transition-colors"
              >
                Reset to Default Settings
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleResetSettings}
                  className="flex-1 px-4 py-2 bg-[#007AFF] text-white rounded-lg hover:bg-[#0056B3] transition-colors"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2 bg-[#E0E0E0] dark:bg-[#404040] text-[#717171] dark:text-[#B3B3B3] rounded-lg hover:bg-[#CCCCCC] dark:hover:bg-[#4D4D4D] transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Disconnect Account */}
            {!showDisconnectConfirm ? (
              <button
                onClick={() => setShowDisconnectConfirm(true)}
                className="w-full px-4 py-2 bg-[#FF5C5C]/10 text-[#FF5C5C] rounded-lg hover:bg-[#FF5C5C]/20 transition-colors"
              >
                Disconnect Telegram Account
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    // Handle disconnect
                    setShowDisconnectConfirm(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[#FF5C5C] text-white rounded-lg hover:bg-[#E63939] transition-colors"
                >
                  Confirm Disconnect
                </button>
                <button
                  onClick={() => setShowDisconnectConfirm(false)}
                  className="flex-1 px-4 py-2 bg-[#E0E0E0] dark:bg-[#404040] text-[#717171] dark:text-[#B3B3B3] rounded-lg hover:bg-[#CCCCCC] dark:hover:bg-[#4D4D4D] transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Security Info */}
          <div className="mt-8 p-4 bg-[#F5F5F5] dark:bg-[#2D2D2D] rounded-lg border border-[#E0E0E0] dark:border-[#404040]">
            <h3 className="text-[#1E1E1E] dark:text-white font-medium mb-2">
              Security Information
            </h3>
            <ul className="space-y-2 text-sm text-[#717171] dark:text-[#B3B3B3]">
              <li className="flex items-start space-x-2">
                <span className="text-[#007AFF]">•</span>
                <span>
                  Two-factor authentication adds an extra layer of security to your
                  account
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#007AFF]">•</span>
                <span>
                  End-to-end encryption ensures only you and your chat partner can
                  read messages
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#007AFF]">•</span>
                <span>
                  Location data is only shared during active rides and deliveries
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#007AFF]">•</span>
                <span>
                  Payment confirmations help prevent unauthorized transactions
                </span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-[#717171] dark:text-[#B3B3B3]">
            Connect your Telegram account to manage security settings
          </p>
          {error && <p className="text-sm text-[#FF5C5C] mt-4">{error}</p>}
        </div>
      )}
    </div>
  );
}
