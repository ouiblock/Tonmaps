interface LeaderboardEntry {
  rank: number;
  username: string;
  telegramId: string;
  points: number;
  earnings: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserRank?: number;
}

export default function Leaderboard({ entries, currentUserRank }: LeaderboardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performers</h2>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {entries.map((entry) => (
          <div
            key={entry.telegramId}
            className={`p-4 flex items-center justify-between ${
              entry.rank === currentUserRank
                ? 'bg-[#0088CC]/10 dark:bg-[#0088CC]/20'
                : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="w-8 text-center font-semibold text-gray-500 dark:text-gray-400">
                {entry.rank}
              </span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {entry.username}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{entry.telegramId}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900 dark:text-white">
                {entry.points} pts
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {entry.earnings.toFixed(2)} TON
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
