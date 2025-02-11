import { createContext, useContext, ReactNode } from 'react';

interface TelegramContextType {
  isConnected: boolean;
  username: string | null;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  sendTelegramMessage: (params: { username: string; message: string; type: string }) => void;
}

const TelegramContext = createContext<TelegramContextType>({
  isConnected: false,
  username: null,
  error: null,
  connect: () => {},
  disconnect: () => {},
  sendTelegramMessage: () => {},
});

export function TelegramProvider({ children }: { children: ReactNode }) {
  // Simplified mock implementation
  const mockTelegram = {
    isConnected: false,
    username: null,
    error: null,
    connect: () => {
      console.log('Connect Telegram clicked');
    },
    disconnect: () => {
      console.log('Disconnect Telegram clicked');
    },
    sendTelegramMessage: (params: { username: string; message: string; type: string }) => {
      console.log('Send message:', params);
    },
  };

  return (
    <TelegramContext.Provider value={mockTelegram}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
}
