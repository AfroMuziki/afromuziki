// frontend/src/pages/public/ContentDetailPage/ContentDetailPage.tsx
import { useParams } from 'react-router-dom';
import { useContent } from '../../../hooks/content/useContent';
import { AudioPlayer } from '../../../components/media/AudioPlayer/AudioPlayer';
import { VideoPlayer } from '../../../components/media/VideoPlayer/VideoPlayer';
import { LikeButton } from '../../../components/engagement/LikeButton/LikeButton';
import { CommentSection } from '../../../components/engagement/CommentSection/CommentSection';
import { ShareButton } from '../../../components/engagement/ShareButton/ShareButton';
import { DownloadButton } from '../../../components/engagement/DownloadButton/DownloadButton';
import { ArtistCard } from '../../../components/artist/ArtistCard/ArtistCard';
import { RelatedContent } from './components/RelatedContent';
import { ContentStats } from './components/ContentStats';
import { LoadingSpinner } from '../../../components/ui/Spinner/Spinner';
import { NotFoundPage } from '../NotFoundPage';
import { useAuthStore } from '../../../store/authStore';

export const ContentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { data: content, isLoading, error } = useContent(id!);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !content) {
    return <NotFoundPage />;
  }

  const isOwner = user?.id === content.artist_id;
  const canDownload = content.is_downloadable || isOwner;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section with Player */}
      <div className="bg-gradient-to-b from-navy-900 to-navy-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Thumbnail */}
            <div className="lg:col-span-1">
              <img
                src={content.thumbnail_url}
                alt={content.title}
                className="w-full rounded-xl shadow-2xl"
              />
            </div>

            {/* Content Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{content.title}</h1>
                  <p className="text-xl text-gray-300">
                    by {content.artist?.username || 'Unknown Artist'}
                  </p>
                </div>
                {content.is_verified && (
                  <span className="bg-gold-500 text-navy-900 px-3 py-1 rounded-full text-sm font-semibold">
                    Verified Artist
                  </span>
                )}
              </div>

              <ContentStats
                plays={content.plays}
                likes={content.likes_count}
                comments={content.comments_count}
                downloads={content.downloads_count}
              />

              <div className="flex flex-wrap gap-4">
                <LikeButton contentId={content.id} initialLiked={content.is_liked} />
                <ShareButton title={content.title} url={window.location.href} />
                {canDownload && <DownloadButton contentId={content.id} title={content.title} />}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-gray-300">{content.description || 'No description provided'}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                  {content.genre}
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm capitalize">
                  {content.type}
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                  {content.duration}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player Section */}
      <div className="container mx-auto px-4 py-8">
        {content.type === 'audio' ? (
          <AudioPlayer
            src={content.audio_url!}
            title={content.title}
            artist={content.artist?.username}
            thumbnail={content.thumbnail_url}
          />
        ) : (
          <VideoPlayer
            src={content.video_url!}
            title={content.title}
            poster={content.thumbnail_url}
          />
        )}
      </div>

      {/* Artist Section */}
      {content.artist && (
        <div className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-6">About the Artist</h2>
          <ArtistCard artist={content.artist} size="large" />
        </div>
      )}

      {/* Comments Section */}
      <div className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-800">
        <CommentSection contentId={content.id} />
      </div>

      {/* Related Content */}
      <div className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-800">
        <RelatedContent contentId={content.id} genre={content.genre} />
      </div>
    </div>
  );
};
