import { useState } from 'react';
import TelegramLogo from '../../components/icons/TelegramLogo';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'user' | 'other';
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  // Mock data for chats
  const chats: Chat[] = [
    {
      id: '1',
      name: 'John Driver',
      lastMessage: "I will be there in 5 minutes",
      timestamp: '09:30',
      unread: 2,
    },
    {
      id: '2',
      name: 'Sarah Passenger',
      lastMessage: 'Thanks for the ride!',
      timestamp: '09:15',
      unread: 0,
    },
    {
      id: '3',
      name: 'Mike Delivery',
      lastMessage: 'Package delivered successfully',
      timestamp: '09:00',
      unread: 1,
    },
  ];

  // Mock data for messages
  const messages: { [key: string]: Message[] } = {
    '1': [
      {
        id: '1',
        text: 'Hi, I booked a ride for 10 AM',
        timestamp: '09:25',
        sender: 'user',
      },
      {
        id: '2',
        text: "I will be there in 5 minutes",
        timestamp: '09:30',
        sender: 'other',
      },
    ],
    '2': [
      {
        id: '1',
        text: 'Great ride, thank you!',
        timestamp: '09:10',
        sender: 'other',
      },
      {
        id: '2',
        text: 'Thanks for the ride!',
        timestamp: '09:15',
        sender: 'other',
      },
    ],
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    // In a real app, this would send the message to a backend
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Chat List */}
        <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <TelegramLogo className="w-6 h-6 text-[#0088CC]" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Messages</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`w-full p-4 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  selectedChat === chat.id ? 'bg-gray-50 dark:bg-gray-700' : ''
                }`}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-[#0088CC] rounded-full flex items-center justify-center text-white">
                  <TelegramLogo className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {chat.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{chat.timestamp}</p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="bg-[#0088CC] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-[#0088CC] rounded-full flex items-center justify-center text-white">
                    <TelegramLogo className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      {chats.find((chat) => chat.id === selectedChat)?.name}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 h-[400px] overflow-y-auto space-y-4">
                {messages[selectedChat]?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-[#0088CC] text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-[#0088CC] focus:ring-[#0088CC]"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="px-4 py-2 bg-[#0088CC] text-white rounded-lg hover:bg-[#0088CC]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-[500px] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 space-y-4">
              <TelegramLogo className="w-16 h-16 text-[#0088CC] opacity-50" />
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
