import { useState } from 'react';
import TelegramLogo from '../../components/icons/TelegramLogo';
import Stats from '../../components/profile/Stats';
import Leaderboard from '../../components/profile/Leaderboard';
import ActivityList from '../../components/profile/ActivityList';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: 'John Doe',
    telegramId: 'johndoe123',
    walletAddress: '0x1234...5678',
    bio: 'Professional driver with 5+ years of experience',
  });

  // Mock data
  const stats = {
    rides: 150,
    deliveries: 75,
    rating: 4.8,
    totalEarned: 312.5, // 1250 USD worth of TON (at $4 per TON)
    tmapCashback: 104166.67, // 625 USD worth of TMAP (at $0.006 per TMAP)
    tmapBalance: 75000, // 450 USD worth of TMAP (at $0.006 per TMAP)
  };

  const leaderboardEntries = [
    {
      rank: 1,
      username: 'Sarah Driver',
      telegramId: 'sarahd',
      points: 1500,
      earnings: 2500.75,
    },
    {
      rank: 2,
      username: 'John Doe',
      telegramId: 'johndoe123',
      points: 1350,
      earnings: 1250.5,
    },
    {
      rank: 3,
      username: 'Mike Rider',
      telegramId: 'mikerider',
      points: 1200,
      earnings: 980.25,
    },
    {
      rank: 4,
      username: 'Emma Swift',
      telegramId: 'emmaswift',
      points: 1100,
      earnings: 850.0,
    },
    {
      rank: 5,
      username: 'Tom Speed',
      telegramId: 'tomspeed',
      points: 1000,
      earnings: 750.5,
    },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'ride' as const,
      status: 'completed' as const,
      timestamp: '2 hours ago',
      amount: 25.5,
      details: 'Ride from Downtown to Airport',
    },
    {
      id: '2',
      type: 'delivery' as const,
      status: 'ongoing' as const,
      timestamp: '5 hours ago',
      amount: 15.75,
      details: 'Package delivery to 123 Main St',
    },
    {
      id: '3',
      type: 'ride' as const,
      status: 'cancelled' as const,
      timestamp: 'Yesterday',
      amount: 0,
      details: 'Ride cancelled by passenger',
    },
  ];

  const handleProfileUpdate = () => {
    setIsEditing(false);
    // In a real app, this would update the profile in the backend
    console.log('Updated profile:', profile);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-[#0088CC] rounded-full flex items-center justify-center text-white">
                  <TelegramLogo className="w-12 h-12" />
                </div>
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) =>
                        setProfile({ ...profile, username: e.target.value })
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0088CC] focus:border-[#0088CC] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <input
                      type="text"
                      value={profile.telegramId}
                      onChange={(e) =>
                        setProfile({ ...profile, telegramId: e.target.value })
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0088CC] focus:border-[#0088CC] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profile.username}
                    </h1>
                    <p className="text-[#0088CC]">@{profile.telegramId}</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => (isEditing ? handleProfileUpdate() : setIsEditing(true))}
                className="px-4 py-2 bg-[#0088CC] text-white rounded-lg hover:bg-[#0088CC]/90 transition-colors"
              >
                {isEditing ? 'Save' : 'Edit Profile'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Wallet Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.walletAddress}
                    onChange={(e) =>
                      setProfile({ ...profile, walletAddress: e.target.value })
                    }
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0088CC] focus:border-[#0088CC] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 font-mono">
                    {profile.walletAddress}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0088CC] focus:border-[#0088CC] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <Stats stats={stats} />

          {/* Recent Activity */}
          <ActivityList activities={recentActivities} />
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-1">
          <Leaderboard entries={leaderboardEntries} currentUserRank={2} />
        </div>
      </div>
    </div>
  );
}
