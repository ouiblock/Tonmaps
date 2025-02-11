import { useState, useEffect } from 'react';
import { User } from '../types';

interface LeaderboardUser extends User {
  totalDistance: number;
  totalRides: number;
  totalEarnings: number;
}

export const Leaderboard = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'rides' | 'distance' | 'earnings'>('rides');

  useEffect(() => {
    // Simulate loading leaderboard data
    setTimeout(() => {
      setUsers([
        {
          address: '0x1234...5678',
          telegramUsername: 'john_doe',
          displayName: 'John Doe',
          avatarUrl: 'https://via.placeholder.com/40',
          bio: 'Regular driver',
          verificationLevel: 2,
          rating: 4.8,
          totalRides: 156,
          totalDistance: 12500,
          totalEarnings: 2450,
          languages: ['en', 'fr'],
          preferences: {
            smoking: false,
            pets: true,
            music: true,
            chat: true
          }
        },
        // Add more users here
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getSortedUsers = () => {
    return [...users].sort((a, b) => {
      switch (sortBy) {
        case 'rides':
          return b.totalRides - a.totalRides;
        case 'distance':
          return b.totalDistance - a.totalDistance;
        case 'earnings':
          return b.totalEarnings - a.totalEarnings;
        default:
          return 0;
      }
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2AABEE] mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Top Drivers</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setSortBy('rides')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              sortBy === 'rides'
                ? 'bg-[#2AABEE] text-white'
                : 'bg-[#2AABEE]/20 text-[#2AABEE] hover:bg-[#2AABEE]/30'
            }`}
          >
            Rides
          </button>
          <button
            onClick={() => setSortBy('distance')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              sortBy === 'distance'
                ? 'bg-[#2AABEE] text-white'
                : 'bg-[#2AABEE]/20 text-[#2AABEE] hover:bg-[#2AABEE]/30'
            }`}
          >
            Distance
          </button>
          <button
            onClick={() => setSortBy('earnings')}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              sortBy === 'earnings'
                ? 'bg-[#2AABEE] text-white'
                : 'bg-[#2AABEE]/20 text-[#2AABEE] hover:bg-[#2AABEE]/30'
            }`}
          >
            Earnings
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {getSortedUsers().map((user, index) => (
          <div
            key={user.address}
            className="bg-[#242f3d] rounded-xl p-4 flex items-center space-x-4"
          >
            <div className="text-2xl font-bold text-[#2AABEE] w-8">
              #{index + 1}
            </div>
            
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-12 h-12 rounded-full object-cover"
              />
              {user.verificationLevel > 0 && (
                <div className="absolute -bottom-1 -right-1 bg-[#2AABEE] rounded-full p-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white">{user.displayName}</span>
                <span className="text-sm text-gray-400">
                  @{user.telegramUsername || user.address.slice(0, 6)}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                ⭐ {user.rating.toFixed(1)} • {user.totalRides} rides
              </div>
            </div>

            <div className="text-right">
              <div className="font-medium text-white">
                {sortBy === 'rides' && `${user.totalRides} rides`}
                {sortBy === 'distance' && `${(user.totalDistance / 1000).toFixed(1)}k km`}
                {sortBy === 'earnings' && `${user.totalEarnings} EUR`}
              </div>
              <div className="text-sm text-gray-400">
                {user.languages.map(lang => lang.toUpperCase()).join(', ')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
