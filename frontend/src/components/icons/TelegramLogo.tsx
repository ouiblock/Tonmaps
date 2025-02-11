interface TelegramLogoProps {
  className?: string;
}

export default function TelegramLogo({ className = "w-6 h-6" }: TelegramLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.94 8.13L15.45 18.1c-.19.8-.7.99-1.42.61l-3.93-2.9-1.89 1.83c-.21.21-.39.39-.8.39l.28-4.03 7.32-6.62c.32-.28-.07-.44-.49-.16l-9.05 5.71-3.9-1.22c-.85-.27-.86-.85.18-1.26l15.21-5.86c.71-.27 1.33.16 1.08 1.24z"/>
    </svg>
  );
}
