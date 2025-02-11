class TelegramService {
  private static instance: TelegramService;
  private baseUrl: string = '/api/telegram';
  private botUsername: string = 'OnzroadBot';

  private constructor() {
    this.initializeTelegramWidget();
  }

  public static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  private initializeTelegramWidget() {
    // Add Telegram Widget Script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', this.botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-request-access', 'write');
    script.async = true;
    document.head.appendChild(script);
  }

  async sendMessage(params: {
    username: string;
    message: string;
    type: 'ride' | 'delivery' | 'order' | 'chat';
    data?: {
      rideId?: string;
      deliveryId?: string;
      orderId?: string;
      location?: {
        lat: number;
        lng: number;
      };
    };
  }): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to send Telegram message');
      }
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      throw error;
    }
  }

  async startBot(username: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error('Failed to start Telegram bot');
      }
    } catch (error) {
      console.error('Error starting Telegram bot:', error);
      throw error;
    }
  }

  async verifyUser(params: {
    id: number;
    first_name: string;
    last_name?: string;
    username: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
  }): Promise<{
    verified: boolean;
    telegramId: number;
    username: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to verify Telegram user');
      }

      return response.json();
    } catch (error) {
      console.error('Error verifying Telegram user:', error);
      throw error;
    }
  }

  async getDeepLink(params: {
    type: 'ride' | 'delivery' | 'order';
    id: string;
  }): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/deeplink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to generate Telegram deep link');
      }

      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error('Error generating Telegram deep link:', error);
      throw error;
    }
  }

  getBotUsername(): string {
    return this.botUsername;
  }

  getTelegramProfileUrl(username: string): string {
    return `https://t.me/${username}`;
  }

  getTelegramShareUrl(text: string): string {
    return `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
  }
}

export default TelegramService.getInstance();
