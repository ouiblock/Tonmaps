import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import NotificationService, { Notification } from '../services/NotificationService';
import { useWallet } from './WalletContext';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  sendNotification: (params: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    data?: {
      rideId?: string;
      deliveryId?: string;
      orderId?: string;
      url?: string;
    };
  }) => Promise<void>;
  markAsRead: (notificationIds: string[]) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAll: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useWallet();
  const { user } = useAuth();

  useEffect(() => {
    if (!address) return;

    // Subscribe to new notifications
    const unsubscribe = NotificationService.onNotification((notification) => {
      if (notification.userId === address) {
        setNotifications(prev => [notification, ...prev]);
        if (!notification.read) {
          setUnreadCount(prev => prev + 1);
        }
      }
    });

    // Load initial notifications and unread count
    setIsLoading(true);
    Promise.all([
      NotificationService.getNotifications(address),
      NotificationService.getUnreadCount(address)
    ])
      .then(([notifications, count]) => {
        setNotifications(notifications);
        setUnreadCount(count);
      })
      .catch(error => {
        console.error('Error loading notifications:', error);
        setError('Failed to load notifications');
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      unsubscribe();
    };
  }, [address]);

  const sendNotification = useCallback(async (params: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    data?: {
      rideId?: string;
      deliveryId?: string;
      orderId?: string;
      url?: string;
    };
  }) => {
    if (!address || !user) {
      setError('Please connect your wallet and sign in to send notifications');
      return;
    }

    setError(null);

    try {
      const notification = await NotificationService.sendNotification({
        userId: address,
        ...params
      });
      setNotifications(prev => [notification, ...prev]);
    } catch (err) {
      setError('Failed to send notification. Please try again.');
      console.error('Send notification error:', err);
    }
  }, [address, user]);

  const markAsRead = useCallback(async (notificationIds: string[]) => {
    if (!address || !user) return;

    try {
      await NotificationService.markAsRead(notificationIds);
      setNotifications(prev => prev.map(notification => 
        notificationIds.includes(notification.id) ? { ...notification, read: true } : notification
      ));
      setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  }, [address, user]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!address || !user) return;

    try {
      await NotificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
    } catch (err) {
      setError('Failed to delete notification. Please try again.');
      console.error('Delete notification error:', err);
    }
  }, [address, user]);

  const clearAll = useCallback(async () => {
    if (!address || !user) return;

    try {
      await NotificationService.clearAll(address);
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      setError('Failed to clear notifications. Please try again.');
      console.error('Clear notifications error:', err);
    }
  }, [address, user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        sendNotification,
        markAsRead,
        deleteNotification,
        clearAll,
        isLoading,
        error,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
