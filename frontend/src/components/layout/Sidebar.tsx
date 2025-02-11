import { useRouter } from 'next/router';
import Link from 'next/link';
import { useWallet } from '../../contexts/WalletContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    id: 'carpooling',
    label: 'Carpooling',
    icon: '🚗',
    href: '/carpooling',
    description: 'Find or offer rides',
  },
  {
    id: 'parcel',
    label: 'Parcel Delivery',
    icon: '📦',
    href: '/parcel',
    description: 'Send or deliver packages',
  },
  {
    id: 'food',
    label: 'Food Delivery',
    icon: '🍔',
    href: '/food',
    description: 'Order or deliver food',
  },
];

const quickActions = [
  {
    id: 'find-ride',
    label: 'Find a Ride',
    icon: '🚗',
    href: '/carpooling/search',
    color: '#007AFF',
  },
  {
    id: 'send-package',
    label: 'Send a Package',
    icon: '📦',
    href: '/parcel/send',
    color: '#38D39F',
  },
  {
    id: 'order-food',
    label: 'Order Food',
    icon: '🍔',
    href: '/food/restaurants',
    color: '#FF8C42',
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const { balance } = useWallet();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-white dark:bg-[#2D2D2D] border-r border-[#E0E0E0] dark:border-[#404040] z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E0E0E0] dark:border-[#404040]">
          <h2 className="text-lg font-accent font-bold text-[#1E1E1E] dark:text-white">
            Quick Actions
          </h2>
        </div>

        {/* Quick Actions */}
        <div className="p-4 grid grid-cols-1 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.id}
              href={action.href}
              className="flex items-center space-x-3 p-3 rounded-xl border-2 border-[#E0E0E0] dark:border-[#404040] hover:border-[#007AFF] dark:hover:border-[#007AFF] transition-colors"
              style={{
                background: \`\${action.color}10\`,
              }}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="font-medium" style={{ color: action.color }}>
                {action.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <div className="px-4 pb-2">
            <h3 className="text-sm font-medium text-[#717171] dark:text-[#B3B3B3]">
              Services
            </h3>
          </div>
          {navigationItems.map((item) => {
            const isActive = router.pathname.startsWith(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-start space-x-3 px-4 py-3 transition-colors ${
                  isActive
                    ? 'bg-[#007AFF]/10 text-[#007AFF]'
                    : 'hover:bg-[#F5F5F5] dark:hover:bg-[#3D3D3D] text-[#1E1E1E] dark:text-white'
                }`}
              >
                <span className="text-2xl mt-0.5">{item.icon}</span>
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-[#717171] dark:text-[#B3B3B3]">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Stats */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#E0E0E0] dark:border-[#404040]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#717171] dark:text-[#B3B3B3]">
              This Week
            </span>
            <span className="text-sm font-medium text-[#38D39F]">+5.6 $TMAP</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#717171] dark:text-[#B3B3B3]">
              CO₂ Saved
            </span>
            <span className="text-sm font-medium text-[#38D39F]">26kg 🌱</span>
          </div>
        </div>
      </aside>
    </>
  );
}
