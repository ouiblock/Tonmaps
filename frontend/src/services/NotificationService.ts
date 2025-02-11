interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: number;
  data?: {
    rideId?: string;
    deliveryId?: string;
    orderId?: string;
    url?: string;
  };
}

class NotificationService {
  private static instance: NotificationService;
  private baseUrl: string = '/api/notifications';
  private notificationHandlers: ((notification: Notification) => void)[] = [];

  private constructor() {
    this.initializeEventSource();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private initializeEventSource() {
    const eventSource = new EventSource('/api/notifications/events');

    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      this.notificationHandlers.forEach(handler => handler(notification));
    };

    eventSource.onerror = () => {
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.initializeEventSource(), 5000);
    };
  }

  public onNotification(handler: (notification: Notification) => void) {
    this.notificationHandlers.push(handler);
    return () => {
      this.notificationHandlers = this.notificationHandlers.filter(h => h !== handler);
    };
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const response = await fetch(`${this.baseUrl}/user/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationIds: string[]): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark notifications as read');
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${notificationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  async clearAll(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/user/${userId}/clear`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to clear notifications');
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
      throw error;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/user/${userId}/unread`);

      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }

      const { count } = await response.json();
      return count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  async sendNotification(notification: {
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    data?: {
      rideId?: string;
      deliveryId?: string;
      orderId?: string;
      url?: string;
    };
  }): Promise<Notification> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...notification,
          read: false,
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      return response.json();
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }
}

export type { Notification };
export default NotificationService.getInstance();
