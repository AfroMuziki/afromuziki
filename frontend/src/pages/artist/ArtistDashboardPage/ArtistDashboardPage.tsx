// frontend/src/pages/artist/ArtistDashboardPage/ArtistDashboardPage.tsx
import { useArtistStats } from '../../../hooks/artist/useArtistStats';
import { useArtistRecentActivity } from '../../../hooks/artist/useArtistRecentActivity';
import { StatsCard } from '../../../components/analytics/StatsCard/StatsCard';
import { LineChart } from '../../../components/analytics/LineChart/LineChart';
import { TopContentTable } from '../../../components/analytics/TopContentTable/TopContentTable';
import { LoadingSpinner } from '../../../components/ui/Spinner/Spinner';
import {
  MusicalNoteIcon,
  PlayIcon,
  HeartIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export const ArtistDashboardPage = () => {
  const { data: stats, isLoading: statsLoading } = useArtistStats();
  const { data: activity, isLoading: activityLoading } = useArtistRecentActivity();

  if (statsLoading || activityLoading) {
    return <LoadingSpinner />;
  }

  const statCards = [
    {
      title: 'Total Plays',
      value: stats?.total_plays || 0,
      icon: PlayIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Tracks',
      value: stats?.total_tracks || 0,
      icon: MusicalNoteIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Total Likes',
      value: stats?.total_likes || 0,
      icon: HeartIcon,
      color: 'bg-red-500',
    },
    {
      title: 'Total Downloads',
      value: stats?.total_downloads || 0,
      icon: ArrowDownTrayIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Followers',
      value: stats?.followers_count || 0,
      icon: UserGroupIcon,
      color: 'bg-gold-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Artist Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your performance and grow your audience
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Plays Over Time</h2>
            <LineChart
              data={activity?.plays_over_time || []}
              xAxisKey="date"
              series={[{ key: 'plays', name: 'Plays', color: '#3B82F6' }]}
            />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Engagement Metrics</h2>
            <LineChart
              data={activity?.engagement_over_time || []}
              xAxisKey="date"
              series={[
                { key: 'likes', name: 'Likes', color: '#EF4444' },
                { key: 'comments', name: 'Comments', color: '#10B981' },
                { key: 'downloads', name: 'Downloads', color: '#8B5CF6' },
              ]}
            />
          </div>
        </div>

        {/* Top Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">Top Performing Content</h2>
          </div>
          <TopContentTable data={activity?.top_content || []} />
        </div>
      </div>
    </div>
  );
};
