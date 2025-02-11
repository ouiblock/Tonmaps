import { useRouter } from 'next/router';
import Link from 'next/link';

const navigationItems = [
  {
    id: 'home',
    label: 'Home',
    icon: '🏠',
    href: '/',
  },
  {
    id: 'tracking',
    label: 'Live',
    icon: '📍',
    href: '/tracking',
  },
  {
    id: 'wallet',
    label: 'Wallet',
    icon: '💰',
    href: '/wallet',
  },
  {
    id: 'messages',
    label: 'Chat',
    icon: '📩',
    href: '/messages',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: '👤',
    href: '/profile',
  },
];

export default function BottomNavigation() {
  const router = useRouter();

  return (
    <nav className="h-16">
      <div className="h-full max-w-lg mx-auto grid grid-cols-5">
        {navigationItems.map((item) => {
          const isActive = router.pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive
                  ? 'text-[#007AFF]'
                  : 'text-[#717171] dark:text-[#B3B3B3] hover:text-[#007AFF] dark:hover:text-[#007AFF]'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-12 h-0.5 bg-[#007AFF] rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
