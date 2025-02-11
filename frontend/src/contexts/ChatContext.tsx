import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Message } from '../types';
import ChatService from '../services/ChatService';
import { useWallet } from './WalletContext';
import { useAuth } from './AuthContext';

interface ChatContextType {
  messages: Message[];
  unreadCount: number;
  activeConversation: string | null;
  sendMessage: (to: string, content: string, type?: 'text' | 'location' | 'payment' | 'system') => Promise<void>;
  startConversation: (userId: string) => Promise<void>;
  markAsRead: (messageIds: string[]) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useWallet();
  const { user } = useAuth();

  useEffect(() => {
    if (!address) return;

    // Subscribe to new messages
    const unsubscribe = ChatService.onMessage((message) => {
      if (message.toUser === address || message.fromUser === address) {
        setMessages(prev => [...prev, message]);
        if (message.toUser === address && !message.read) {
          setUnreadCount(prev => prev + 1);
        }
      }
    });

    // Load initial unread count
    ChatService.getUnreadCount(address)
      .then(setUnreadCount)
      .catch(console.error);

    return () => {
      unsubscribe();
    };
  }, [address]);

  const sendMessage = useCallback(async (
    to: string,
    content: string,
    type: 'text' | 'location' | 'payment' | 'system' = 'text'
  ) => {
    if (!address || !user) {
      setError('Please connect your wallet and sign in to send messages');
      return;
    }

    setError(null);

    try {
      const message = await ChatService.sendMessage({
        toUser: to,
        content,
        type,
      });
      setMessages(prev => [...prev, message]);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Send message error:', err);
    }
  }, [address, user]);

  const startConversation = useCallback(async (userId: string) => {
    if (!address || !user) {
      setError('Please connect your wallet and sign in to start a conversation');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const conversation = await ChatService.getConversation(address, userId);
      setMessages(conversation);
      setActiveConversation(userId);
    } catch (err) {
      setError('Failed to load conversation. Please try again.');
      console.error('Load conversation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, user]);

  const markAsRead = useCallback(async (messageIds: string[]) => {
    if (!address || !user) return;

    try {
      await ChatService.markAsRead(messageIds);
      setMessages(prev => prev.map(message => 
        messageIds.includes(message.id) ? { ...message, read: true } : message
      ));
      setUnreadCount(prev => Math.max(0, prev - messageIds.length));
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  }, [address, user]);

  const deleteMessage = useCallback(async (messageId: string) => {
    if (!address || !user) return;

    try {
      await ChatService.deleteMessage(messageId);
      setMessages(prev => prev.filter(message => message.id !== messageId));
    } catch (err) {
      setError('Failed to delete message. Please try again.');
      console.error('Delete message error:', err);
    }
  }, [address, user]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        unreadCount,
        activeConversation,
        sendMessage,
        startConversation,
        markAsRead,
        deleteMessage,
        isLoading,
        error,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
