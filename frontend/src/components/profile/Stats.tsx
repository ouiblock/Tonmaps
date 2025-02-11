import { formatCurrency, convertCurrency } from '../../utils/currency';

interface StatsProps {
  stats: {
    rides: number;
    deliveries: number;
    rating: number;
    totalEarned: number;
    ozrCashback: number;
    ozrBalance: number;
  };
}

export default function Stats({ stats }: StatsProps) {
  const mainStats = [
    { label: 'Total Rides', value: stats.rides.toString() },
    { label: 'Deliveries', value: stats.deliveries.toString() },
    { label: 'Rating', value: `${stats.rating.toFixed(1)}⭐` },
    {
      label: 'Total Earned',
      value: formatCurrency(stats.totalEarned, 'TON'),
      subValue: `≈ ${formatCurrency(convertCurrency.tonToUsd(stats.totalEarned), 'USD')}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {mainStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
              {stat.value}
            </p>
            {'subValue' in stat && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.subValue}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* OZR Cashback Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">OZR Rewards</h3>
            <p className="text-sm text-gray-500">Total Cashback</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#38D39F]">
              {formatCurrency(stats.ozrCashback, 'OZR')}
            </p>
            <p className="text-sm text-gray-500">
              {formatCurrency(stats.ozrBalance, 'OZR')}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="bg-[#38D39F]/10 rounded-lg p-4">
            <h4 className="text-[#38D39F] font-semibold">Cashback Rate</h4>
            <div className="mt-2">
              <p className="text-lg font-semibold mt-1">5% in OZR tokens</p>
              <p className="text-sm opacity-75">1 OZR ≈ $0.006</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
