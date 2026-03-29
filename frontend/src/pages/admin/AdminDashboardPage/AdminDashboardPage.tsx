// frontend/src/pages/admin/AdminDashboardPage/AdminDashboardPage.tsx
import { useAdminStats } from '../../../hooks/admin/useAdminStats';
import { useAdminAnalytics } from '../../../hooks/admin/useAdminAnalytics';
import { StatsCard } from '../../../components/analytics/StatsCard/StatsCard';
import { LineChart } from '../../../components/analytics/LineChart/LineChart';
import { LoadingSpinner } from '../../../components/ui/Spinner/Spinner';
import {
  UsersIcon,
  MusicalNoteIcon,
  FlagIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export const AdminDashboardPage = () => {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();

  if (statsLoading || analyticsLoading) {
    return <LoadingSpinner />;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.total_users || 0,
      icon: UsersIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Content',
      value: stats?.total_content || 0,
      icon: MusicalNoteIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Reports',
      value: stats?.pending_reports || 0,
      icon: FlagIcon,
      color: 'bg-red-500',
    },
    {
      title: 'Pending Moderation',
      value: stats?.pending_moderation || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500',
    },
    {
      title: 'Approved Content',
      value: stats?.approved_content || 0,
      icon: CheckCircleIcon,
      color: 'bg-emerald-500',
    },
    {
      title: 'Total Plays',
      value: stats?.total_plays || 0,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Platform overview and management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {statCards.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">User Growth</h2>
            <LineChart
              data={analytics?.user_growth || []}
              xAxisKey="date"
              series={[{ key: 'users', name: 'New Users', color: '#3B82F6' }]}
            />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Content Uploads</h2>
            <LineChart
              data={analytics?.content_uploads || []}
              xAxisKey="date"
              series={[
                { key: 'audio', name: 'Audio', color: '#10B981' },
                { key: 'video', name: 'Video', color: '#8B5CF6' },
              ]}
            />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Platform Activity</h2>
            <LineChart
              data={analytics?.platform_activity || []}
              xAxisKey="date"
              series={[
                { key: 'plays', name: 'Plays', color: '#EF4444' },
                { key: 'downloads', name: 'Downloads', color: '#F59E0B' },
              ]}
            />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
            <LineChart
              data={analytics?.revenue || []}
              xAxisKey="date"
              series={[{ key: 'revenue', name: 'Revenue', color: '#10B981' }]}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-3">Pending Moderation</h3>
            <p className="text-3xl font-bold text-yellow-600 mb-4">
              {stats?.pending_moderation || 0}
            </p>
            <button className="text-gold-600 hover:text-gold-700 font-medium">
              Review Content →
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-3">Open Reports</h3>
            <p className="text-3xl font-bold text-red-600 mb-4">
              {stats?.pending_reports || 0}
            </p>
            <button className="text-gold-600 hover:text-gold-700 font-medium">
              Handle Reports →
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-3">New Artists</h3>
            <p className="text-3xl font-bold text-green-600 mb-4">
              {stats?.new_artists_this_week || 0}
            </p>
            <button className="text-gold-600 hover:text-gold-700 font-medium">
              View Artists →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
