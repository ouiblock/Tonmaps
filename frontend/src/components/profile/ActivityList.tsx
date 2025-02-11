import { format, isValid } from 'date-fns';

interface Activity {
  id: string;
  type: 'ride' | 'delivery' | 'parcel';
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
  amount: string;
  from: string;
  to: string;
}

interface ActivityListProps {
  activities: Activity[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
  }
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMM d, yyyy h:mm a') : 'Invalid date';
  } catch (error) {
    return 'Invalid date';
  }
};

const ActivityList = ({ activities }: ActivityListProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h2>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {activities.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No activities to display
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.from} → {activity.to}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(activity.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {parseFloat(activity.amount).toFixed(2)} TON
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
                      activity.status
                    )}`}
                  >
                    {activity.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityList;
