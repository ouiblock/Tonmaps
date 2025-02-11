import { useState } from 'react';
import { useTelegram } from '../contexts/TelegramContext';
import { useAuth } from '../contexts/AuthContext';
import theme from '../styles/theme';

interface ChatFeature {
  id: string;
  label: string;
  description: string;
  icon: string;
  available: boolean;
}

const CHAT_FEATURES: ChatFeature[] = [
  {
    id: 'voice_messages',
    label: 'Voice Messages',
    description: 'Send and receive voice messages',
    icon: '🎤',
    available: true,
  },
  {
    id: 'video_messages',
    label: 'Video Messages',
    description: 'Share quick video messages',
    icon: '🎥',
    available: true,
  },
  {
    id: 'file_sharing',
    label: 'File Sharing',
    description: 'Share documents and files',
    icon: '📎',
    available: true,
  },
  {
    id: 'location_sharing',
    label: 'Live Location',
    description: 'Share real-time location during rides',
    icon: '📍',
    available: true,
  },
  {
    id: 'payment_requests',
    label: 'Payment Requests',
    description: 'Send and receive payment requests',
    icon: '💰',
    available: true,
  },
  {
    id: 'quick_replies',
    label: 'Quick Replies',
    description: 'Pre-set messages for common situations',
    icon: '⚡',
    available: true,
  },
];

const QUICK_REPLIES = [
  {
    id: 'arrival',
    message: 'I have arrived at the location.',
    icon: '🚗',
  },
  {
    id: 'delay',
    message: 'I\'ll be slightly delayed. Sorry for the inconvenience.',
    icon: '⏰',
  },
  {
    id: 'pickup',
    message: 'I\'m at the pickup location. Where should I meet you?',
    icon: '📍',
  },
  {
    id: 'delivery',
    message: 'Your delivery has arrived. Where should I leave it?',
    icon: '📦',
  },
  {
    id: 'payment',
    message: 'Could you please confirm the payment?',
    icon: '💳',
  },
  {
    id: 'thanks',
    message: 'Thank you for using Onzrod!',
    icon: '🙏',
  },
];

export default function TelegramChatFeatures() {
  const { isConnected, username, sendTelegramMessage, error } = useTelegram();
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(false);

  const handleQuickReply = async (reply: typeof QUICK_REPLIES[0]) => {
    if (!selectedChat) return;

    try {
      await sendTelegramMessage({
        username: selectedChat,
        message: reply.message,
        type: 'chat',
      });
      setShowQuickReplies(false);
    } catch (error) {
      console.error('Error sending quick reply:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 shadow-lg font-primary">
      <h2 className="text-2xl font-accent font-bold text-[#1E1E1E] dark:text-white mb-6">
        Chat Features
      </h2>

      {isConnected ? (
        <div className="space-y-6">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHAT_FEATURES.map((feature) => (
              <div
                key={feature.id}
                className={`p-4 bg-[#F5F5F5] dark:bg-[#2D2D2D] rounded-lg border border-[#E0E0E0] dark:border-[#404040] transition-all ${
                  feature.available
                    ? 'cursor-pointer hover:border-[#007AFF] dark:hover:border-[#007AFF] hover:shadow-md'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <p className="text-[#1E1E1E] dark:text-white font-medium">
                      {feature.label}
                    </p>
                    <p className="text-sm text-[#717171] dark:text-[#B3B3B3]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-accent font-semibold text-[#1E1E1E] dark:text-white">
                Quick Replies
              </h3>
              <button
                onClick={() => setShowQuickReplies(!showQuickReplies)}
                className="text-[#007AFF] hover:text-[#0056B3] transition-colors"
              >
                {showQuickReplies ? 'Hide' : 'Show'}
              </button>
            </div>

            {showQuickReplies && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply.id}
                    onClick={() => handleQuickReply(reply)}
                    disabled={!selectedChat}
                    className="p-4 bg-[#F5F5F5] dark:bg-[#2D2D2D] rounded-lg text-left border border-[#E0E0E0] dark:border-[#404040] hover:border-[#007AFF] dark:hover:border-[#007AFF] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#E0E0E0] dark:disabled:hover:border-[#404040]"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{reply.icon}</div>
                      <p className="text-sm text-[#1E1E1E] dark:text-white">
                        {reply.message}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat Preview */}
          <div className="mt-8 p-4 bg-[#F5F5F5] dark:bg-[#2D2D2D] rounded-lg border border-[#E0E0E0] dark:border-[#404040]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-accent font-semibold text-[#1E1E1E] dark:text-white">
                Message Preview
              </h3>
              <select
                value={selectedChat || ''}
                onChange={(e) => setSelectedChat(e.target.value)}
                className="bg-white dark:bg-[#3D3D3D] text-[#1E1E1E] dark:text-white rounded-lg px-3 py-1 text-sm border border-[#E0E0E0] dark:border-[#404040] focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-[#007AFF]"
              >
                <option value="">Select chat</option>
                <option value="user1">@user1</option>
                <option value="user2">@user2</option>
              </select>
            </div>

            <div className="space-y-4">
              {/* Voice Message */}
              <div className="flex items-center space-x-3 bg-white dark:bg-[#3D3D3D] p-3 rounded-lg border border-[#E0E0E0] dark:border-[#404040]">
                <button className="w-8 h-8 flex items-center justify-center bg-[#007AFF] rounded-full hover:bg-[#0056B3] transition-colors">
                  <span className="text-white">▶</span>
                </button>
                <div className="flex-1">
                  <div className="h-2 bg-[#F5F5F5] dark:bg-[#2D2D2D] rounded-full">
                    <div className="h-full w-1/3 bg-[#007AFF] rounded-full"></div>
                  </div>
                </div>
                <span className="text-sm text-[#717171] dark:text-[#B3B3B3]">
                  0:15
                </span>
              </div>

              {/* Location Share */}
              <div className="bg-white dark:bg-[#3D3D3D] p-3 rounded-lg border border-[#E0E0E0] dark:border-[#404040]">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">📍</span>
                  <span className="text-[#1E1E1E] dark:text-white">
                    Live Location
                  </span>
                </div>
                <div className="bg-[#F5F5F5] dark:bg-[#2D2D2D] h-32 rounded-lg flex items-center justify-center border border-[#E0E0E0] dark:border-[#404040]">
                  <span className="text-[#717171] dark:text-[#B3B3B3]">
                    Map Preview
                  </span>
                </div>
              </div>

              {/* Payment Request */}
              <div className="bg-white dark:bg-[#3D3D3D] p-3 rounded-lg border border-[#E0E0E0] dark:border-[#404040]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#1E1E1E] dark:text-white">
                    Payment Request
                  </span>
                  <span className="text-[#38D39F]">50 OZR</span>
                </div>
                <button className="w-full px-4 py-2 bg-[#38D39F] text-white rounded-lg hover:bg-[#2BA77C] transition-colors">
                  Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-[#717171] dark:text-[#B3B3B3]">
            Connect your Telegram account to access chat features
          </p>
          {error && (
            <p className="text-sm text-[#FF5C5C] mt-4">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
