import { useEffect, useRef } from 'react';
import { useTelegram } from '../contexts/TelegramContext';
import TelegramService from '../services/TelegramService';

interface TelegramAuthButtonProps {
  onSuccess?: () => void;
  size?: 'small' | 'medium' | 'large';
  cornerRadius?: number;
  requestAccess?: 'write' | undefined;
  showAvatar?: boolean;
}

export default function TelegramAuthButton({
  onSuccess,
  size = 'large',
  cornerRadius = 8,
  requestAccess = 'write',
  showAvatar = true,
}: TelegramAuthButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { error } = useTelegram();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', TelegramService.getBotUsername());
    script.setAttribute('data-size', size);
    script.setAttribute('data-radius', cornerRadius.toString());
    script.setAttribute('data-request-access', requestAccess || '');
    script.setAttribute('data-userpic', showAvatar.toString());
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;

    // Add callback to window object
    (window as any).onTelegramAuth = (user: any) => {
      if (onSuccess) {
        onSuccess();
      }
    };

    // Clean up any existing button
    if (buttonRef.current) {
      buttonRef.current.innerHTML = '';
      buttonRef.current.appendChild(script);
    }

    return () => {
      if (buttonRef.current) {
        buttonRef.current.innerHTML = '';
      }
      delete (window as any).onTelegramAuth;
    };
  }, [size, cornerRadius, requestAccess, showAvatar, onSuccess]);

  return (
    <div className="flex flex-col items-center">
      <div ref={buttonRef} className="telegram-login-button" />
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
