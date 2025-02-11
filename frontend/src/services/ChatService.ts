import { Message } from '../types';

class ChatService {
  private static instance: ChatService;
  private baseUrl: string = '/api/messages';
  private ws: WebSocket | null = null;
  private messageHandlers: ((message: Message) => void)[] = [];

  private constructor() {
    this.initializeWebSocket();
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private initializeWebSocket() {
    // In production, use wss:// for secure WebSocket connection
    this.ws = new WebSocket('ws://localhost:3001/ws');

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messageHandlers.forEach(handler => handler(message));
    };

    this.ws.onclose = () => {
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.initializeWebSocket(), 5000);
    };
  }

  public onMessage(handler: (message: Message) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  async sendMessage(message: {
    toUser: string;
    content: string;
    rideId?: string;
    deliveryId?: string;
    type: 'text' | 'location' | 'payment' | 'system';
  }): Promise<Message> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...message,
          timestamp: Date.now(),
          read: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getConversation(userId: string, otherId: string): Promise<Message[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/conversation?user1=${userId}&user2=${otherId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }

  async markAsRead(messageIds: string[]): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark messages as read');
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/unread/${userId}`);

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

  async deleteMessage(messageId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${messageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
}

export default ChatService.getInstance();
